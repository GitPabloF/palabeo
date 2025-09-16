import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import {
  validateUserId,
  validateWordId,
  createValidationErrorResponse,
  sanitizeWordData,
  isAdminRole,
} from "@/lib/validation"

/**
 * Add a word to a user's list
 * @param request - The request object
 * @param params - The parameters object
 * @returns The added word
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; wordId: string }> }
) {
  try {
    const session = await getServerSession()
    const { userId, wordId } = await params

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

    // Validate wordId format
    const wordIdValidation = validateWordId(wordId)
    if (!wordIdValidation.success) {
      return NextResponse.json(
        createValidationErrorResponse(wordIdValidation.errors),
        { status: 400 }
      )
    }

    const validatedUserId = userIdValidation.data!
    const validatedWordId = wordIdValidation.data!

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user can modify this data (own data or admin)
    if (currentUser.id !== validatedUserId && !isAdminRole(currentUser.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: validatedUserId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if the word exists
    const word = await prisma.word.findUnique({
      where: { id: validatedWordId },
    })

    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 })
    }

    // Check if the user already has this word in their list
    const existingUserWord = await prisma.userWord.findUnique({
      where: {
        userId_wordId: {
          userId: validatedUserId,
          wordId: validatedWordId,
        },
      },
    })

    if (existingUserWord) {
      return NextResponse.json(
        { error: "Word already exists in user's list" },
        { status: 409 }
      )
    }

    // Create a new user word
    const userWord = await prisma.userWord.create({
      data: {
        userId: validatedUserId,
        wordId: validatedWordId,
      },
      include: {
        word: true,
      },
    })

    return NextResponse.json(
      {
        message: "Word added successfully",
        data: {
          userWord: {
            id: userWord.id,
            userId: userWord.userId,
            wordId: userWord.wordId,
            createdAt: userWord.createdAt,
            word: sanitizeWordData(userWord.word),
          },
        },
      },
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
  { params }: { params: Promise<{ userId: string; wordId: string }> }
) {
  try {
    const session = await getServerSession()
    const { userId, wordId } = await params

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

    // Validate wordId format
    const wordIdValidation = validateWordId(wordId)
    if (!wordIdValidation.success) {
      return NextResponse.json(
        createValidationErrorResponse(wordIdValidation.errors),
        { status: 400 }
      )
    }

    const validatedUserId = userIdValidation.data!
    const validatedWordId = wordIdValidation.data!

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user can modify this data (own data or admin)
    if (currentUser.id !== validatedUserId && !isAdminRole(currentUser.role)) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own words" },
        { status: 403 }
      )
    }

    // Check if the UserWord relation exists
    const userWord = await prisma.userWord.findUnique({
      where: {
        userId_wordId: {
          userId: validatedUserId,
          wordId: validatedWordId,
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
          userId: validatedUserId,
          wordId: validatedWordId,
        },
      },
    })

    return NextResponse.json({
      message: "Word deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting word:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
