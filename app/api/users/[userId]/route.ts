import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import {
  validateUserId,
  validateUserUpdateData,
  createValidationErrorResponse,
  sanitizeUserData,
  isAdminRole,
} from "@/lib/validation"

/**
 * Get a user by id
 * @param request - The request object
 * @param params - The parameters object
 * @returns The user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession()
    const { userId } = await params

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate userId format
    const userIdValidation = validateUserId(userId)
    if (!userIdValidation.success) {
      return NextResponse.json(
        createValidationErrorResponse(userIdValidation.errors),
        { status: 400 }
      )
    }

    const validatedUserId = userIdValidation.data!

    // Get the connected user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify that the user can only access their own data
    if (currentUser.id !== validatedUserId && !isAdminRole(currentUser.role)) {
      return NextResponse.json(
        { error: "Forbidden: You can only access your own data" },
        { status: 403 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: validatedUserId },
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

    return NextResponse.json({
      message: "User retrieved successfully",
      data: sanitizedUser,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Update a user
 * @param request - The request object
 * @param params - The parameters object
 * @returns The updated user
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession()
    const { userId } = await params

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate userId format
    const userIdValidation = validateUserId(userId)
    if (!userIdValidation.success) {
      return NextResponse.json(
        createValidationErrorResponse(userIdValidation.errors),
        { status: 400 }
      )
    }

    const validatedUserId = userIdValidation.data!

    // Get the connected user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify that the user can only modify their own data
    if (currentUser.id !== validatedUserId && !isAdminRole(currentUser.role)) {
      return NextResponse.json(
        { error: "Forbidden: You can only modify your own data" },
        { status: 403 }
      )
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

    // Validate and sanitize update data
    const validationResult = validateUserUpdateData(requestBody)
    if (!validationResult.success) {
      return NextResponse.json(
        createValidationErrorResponse(validationResult.errors),
        { status: 400 }
      )
    }

    const updateData = validationResult.data!

    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: updateData.email },
      })
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { id: validatedUserId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    })

    // Sanitize user data before returning
    const sanitizedUser = sanitizeUserData(user)

    return NextResponse.json({
      message: "User updated successfully",
      data: sanitizedUser,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Delete a user
 * @param request - The request object
 * @param params - The parameters object
 * @returns The deleted user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession()
    const { userId } = await params

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate userId format
    const userIdValidation = validateUserId(userId)
    if (!userIdValidation.success) {
      return NextResponse.json(
        createValidationErrorResponse(userIdValidation.errors),
        { status: 400 }
      )
    }

    const validatedUserId = userIdValidation.data!

    // Get the connected user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify that the user can only delete their own account
    if (currentUser.id !== validatedUserId) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own account" },
        { status: 403 }
      )
    }

    await prisma.user.delete({
      where: { id: validatedUserId },
    })

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
