import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import {
  validateUserCreationData,
  createValidationErrorResponse,
  isAdminRole,
  sanitizeUserData,
} from "@/lib/validation"
/**
 * Create a new user
 * @param request - The request object
 * @returns The created user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isAdminRole(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Parse and validate JSON body
    let requestBody
    try {
      requestBody = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    // Validate and sanitize all input data
    const validationResult = validateUserCreationData(requestBody)

    if (!validationResult.success) {
      return NextResponse.json(
        createValidationErrorResponse(validationResult.errors),
        { status: 400 }
      )
    }

    const { email, name, userLanguage, learnedLanguage } =
      validationResult.data!

    // verify is the user already exist
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exist with this email" },
        { status: 409 }
      )
    }
    // create the user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        userLanguage,
        learnedLanguage,
      },
    })

    return NextResponse.json(
      {
        message: "User sucessfully created",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Could not create the user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Get all users
 * @returns The users
 */
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isAdminRole(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userLanguage: true,
        learnedLanguage: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            userWords: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Sanitize user data before returning (remove any potential sensitive data)
    const sanitizedUsers = users.map(sanitizeUserData)

    return NextResponse.json({
      message: "Users retrieved successfully",
      data: sanitizedUsers,
      count: sanitizedUsers.length,
    })
  } catch (error) {
    console.error("Error occured when get all the users: ", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
