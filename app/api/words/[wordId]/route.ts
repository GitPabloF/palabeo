import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import {
  validateWordId,
  createValidationErrorResponse,
  validateSession,
  isAdminRole,
} from "@/lib/validation"

/**
 * Get a word by ID
 * @param request - The request object
 * @param params - The parameters object
 * @returns The word
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wordId: string }> }
) {
  const session = await getServerSession()
  // Validate session with robust validation
  const sessionValidation = validateSession(session)
  if (!sessionValidation.success) {
    return NextResponse.json(
      createValidationErrorResponse(sessionValidation.errors),
      { status: 401 }
    )
  }

  const { wordId } = await params

  // Validate wordId parameter
  const validationResult = validateWordId(wordId)
  if (!validationResult.success) {
    return NextResponse.json(
      createValidationErrorResponse(validationResult.errors),
      { status: 400 }
    )
  }

  const wordIdNumber = validationResult.data

  const word = await prisma.word.findUnique({
    where: {
      id: wordIdNumber,
    },
    include: {
      userWords: true,
    },
  })

  if (!word) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 })
  }

  return NextResponse.json(word)
}

/**
 * Delete a word by ID
 * @param request - The request object
 * @param params - The parameters object
 * @returns The deleted word
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ wordId: string }> }
) {
  const session = await getServerSession()
  // Validate session with robust validation
  const sessionValidation = validateSession(session)
  if (!sessionValidation.success) {
    return NextResponse.json(
      createValidationErrorResponse(sessionValidation.errors),
      { status: 401 }
    )
  }

  if (!isAdminRole(sessionValidation.data!.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { wordId } = await params

  // Validate wordId parameter
  const validationResult = validateWordId(wordId)
  if (!validationResult.success) {
    return NextResponse.json(
      createValidationErrorResponse(validationResult.errors),
      { status: 400 }
    )
  }

  const wordIdNumber = validationResult.data

  // Check if word exists before attempting to delete
  const existingWord = await prisma.word.findUnique({
    where: {
      id: wordIdNumber,
    },
  })

  if (!existingWord) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 })
  }

  const word = await prisma.word.delete({
    where: {
      id: wordIdNumber,
    },
  })

  return NextResponse.json({ message: "Word deleted" }, { status: 200 })
}
