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
    })

    return NextResponse.json(userWords)
  } catch (error) {
    console.error("Error fetching words:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
