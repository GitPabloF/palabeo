import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; wordId: string } }
) {
  try {
    const wordId = parseInt(params.wordId)
    const userId = params.userId

    if (!userId) {
      return NextResponse.json(
        {
          error: "You must provide an userId",
        },
        {
          status: 400,
        }
      )
    }

    if (!wordId) {
      return NextResponse.json(
        {
          error: "You must provide a wordId ",
        },
        {
          status: 400,
        }
      )
    }

    const word = await prisma.word.findFirst({
      where: {
        id: wordId,
        userId: userId,
      },
    })

    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 })
    }

    await prisma.word.delete({
      where: { id: wordId },
    })
    return NextResponse.json({
      message: "Mot supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur suppression mot:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
