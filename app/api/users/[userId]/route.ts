import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      include: {
        words: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            words: true,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { name, email } = await request.json()

    const user = await prisma.user.update({
      where: { id: params.userId },
      data: {
        name: name || undefined,
        email: email || undefined,
      },
    })

    return NextResponse.json({
      message: "Utilisateur mis à jour avec succès",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
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
