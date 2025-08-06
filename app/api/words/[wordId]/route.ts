import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

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
  const { wordId } = await params

  if (!wordId) {
    return NextResponse.json({ error: "Word ID is required" }, { status: 400 })
  }

  const wordIdNumber = parseInt(wordId, 10)

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
  const { wordId } = await params

  if (!wordId) {
    return NextResponse.json({ error: "Word ID is required" }, { status: 400 })
  }

  const wordIdNumber = parseInt(wordId, 10)

  if (isNaN(wordIdNumber)) {
    return NextResponse.json(
      { error: "Invalid word ID format" },
      { status: 400 }
    )
  }

  const word = await prisma.word.delete({
    where: {
      id: wordIdNumber,
    },
  })

  if (!word) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 })
  }

  return NextResponse.json({ message: "Word deleted" }, { status: 200 })
}
