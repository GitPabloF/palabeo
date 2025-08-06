import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Get all words for a user
 * @param request - The request object
 * @param params - The parameters object
 * @returns The words
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const userWords = await prisma.userWord.findMany({
      where: {
        userId: userId,
      },
      include: {
        word: true,
      },
    })

    const words = userWords.map((userWord) => userWord.word)
    if (!words) {
      return NextResponse.json({ error: "No words found" }, { status: 404 })
    }

    return NextResponse.json(words)
  } catch (error) {
    console.error("Error fetching words:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
