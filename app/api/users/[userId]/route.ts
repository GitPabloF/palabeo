import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

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

    // Get the connected user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify that the user can only access their own data
    if (currentUser.id !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only access your own data" },
        { status: 403 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    // Get the connected user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify that the user can only modify their own data
    if (currentUser.id !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only modify your own data" },
        { status: 403 }
      )
    }

    const { name, email, userLanguage, learnedLanguage } = await request.json()

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        email: email || undefined,
        userLanguage: userLanguage || undefined,
        learnedLanguage: learnedLanguage || undefined,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userLanguage: user.userLanguage,
        learnedLanguage: user.learnedLanguage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
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

    // Get the connected user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify that the user can only delete their own account
    if (currentUser.id !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own account" },
        { status: 403 }
      )
    }

    await prisma.user.delete({
      where: { id: userId },
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
