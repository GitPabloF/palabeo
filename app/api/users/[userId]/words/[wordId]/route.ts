import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Add a word to a user's list
 * @param request - The request object
 * @param params - The parameters object
 * @returns The added word
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string; wordId: string } }
) {
  try {
    const { userId, wordId } = await params
    if (!userId || !wordId) {
      return NextResponse.json(
        { error: "User ID and Word ID are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if the word exists
    const word = await prisma.word.findUnique({
      where: { id: parseInt(wordId) },
    })

    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 })
    }

    // Check if the user already has this word in their list
    const existingUserWord = await prisma.userWord.findUnique({
      where: {
        userId_wordId: {
          userId,
          wordId: parseInt(wordId),
        },
      },
    })

    if (existingUserWord) {
      return NextResponse.json({ error: "Already exists" }, { status: 409 })
    }

    // Create a new user word
    const userWord = await prisma.userWord.create({
      data: {
        userId,
        wordId: parseInt(wordId),
      },
      include: {
        word: true,
      },
    })

    return NextResponse.json(
      { message: "Word added", userWord },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur création mot:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

/**
 * Delete a word from a user's list
 * @param request - The request object
 * @param params - The parameters object
 * @returns The deleted word
 */
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

    // Check if the UserWord relation exists
    const userWord = await prisma.userWord.findUnique({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
    })

    if (!userWord) {
      return NextResponse.json(
        { error: "Word not found in user's list" },
        { status: 404 }
      )
    }

    // Delete the UserWord relation (not the word itself)
    await prisma.userWord.delete({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
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
