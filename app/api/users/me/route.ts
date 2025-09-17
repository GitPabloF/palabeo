import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import {
  validateSession,
  sanitizeUserData,
  createValidationErrorResponse,
} from "@/lib/validation"

/**
 * Get current user data
 * @param request - The request object
 * @returns The current user data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    // Validate session with robust validation
    const sessionValidation = validateSession(session)
    if (!sessionValidation.success) {
      return NextResponse.json(
        createValidationErrorResponse(sessionValidation.errors),
        { status: 401 }
      )
    }

    const { email } = sessionValidation.data!

    // Get the current user by email from session
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userWords: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            userWords: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Sanitize user data before returning
    const sanitizedUser = sanitizeUserData(user)

    return NextResponse.json(sanitizedUser)
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
