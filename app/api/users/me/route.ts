import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

/**
 * Get current user data
 * @param request - The request object
 * @returns The current user data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the current user by email from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
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

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
