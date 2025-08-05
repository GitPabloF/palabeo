import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Get a user by id
 * @param request - The request object
 * @param params - The parameters object
 * @returns The user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
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
  { params }: { params: { userId: string } }
) {
  try {
    const { name, email, userLanguage, learnedLanguage } = await request.json()

    const user = await prisma.user.update({
      where: { id: params.userId },
      data: {
        name: name || undefined,
        email: email || undefined,
        userLanguage: userLanguage || undefined,
        learnedLanguage: learnedLanguage || undefined,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: "Utilisateur mis à jour avec succès",
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
    console.error("Erreur mise à jour utilisateur:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
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
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 204 }
    )
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
