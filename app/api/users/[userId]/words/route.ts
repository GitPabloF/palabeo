import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import {
  validateUserId,
  validatePaginationParams,
  createValidationErrorResponse,
  sanitizeWordData,
  isAdminRole,
  validateSession,
} from "@/lib/validation"

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
    const session = await getServerSession()
    const { userId } = await params

    // Validate session with robust validation
    const sessionValidation = validateSession(session)
    if (!sessionValidation.success) {
      return NextResponse.json(
        createValidationErrorResponse(sessionValidation.errors),
        { status: 401 }
      )
    }

    // Validate userId format
    const userIdValidation = validateUserId(userId)
    if (!userIdValidation.success) {
      return NextResponse.json(
        createValidationErrorResponse(userIdValidation.errors),
        { status: 400 }
      )
    }

    const validatedUserId = userIdValidation.data!

    const currentUser = await prisma.user.findUnique({
      where: { email: sessionValidation.data!.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user can access this data (own data or admin)
    if (currentUser.id !== validatedUserId && !isAdminRole(currentUser.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Validate pagination parameters (optional)
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")
    const limit = searchParams.get("limit")

    // If no pagination params provided, return all words
    if (!page && !limit) {
      const userWords = await prisma.userWord.findMany({
        where: {
          userId: validatedUserId,
        },
        include: {
          word: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      const words = userWords.map((userWord) => sanitizeWordData(userWord.word))

      return NextResponse.json({
        message: "Words retrieved successfully",
        data: words,
      })
    }

    const paginationValidation = validatePaginationParams(page, limit)
    if (!paginationValidation.success) {
      return NextResponse.json(
        createValidationErrorResponse(paginationValidation.errors),
        { status: 400 }
      )
    }

    const { limit: validatedLimit, offset } = paginationValidation.data!

    // Get total count for pagination metadata
    const totalCount = await prisma.userWord.count({
      where: {
        userId: validatedUserId,
      },
    })

    const userWords = await prisma.userWord.findMany({
      where: {
        userId: validatedUserId,
      },
      include: {
        word: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: validatedLimit,
      skip: offset,
    })

    const words = userWords.map((userWord) => sanitizeWordData(userWord.word))
    const totalPages = Math.ceil(totalCount / validatedLimit)

    return NextResponse.json({
      message: "Words retrieved successfully",
      data: words,
      pagination: {
        page: paginationValidation.data!.page,
        limit: validatedLimit,
        total: totalCount,
        totalPages,
        hasNext: paginationValidation.data!.page < totalPages,
        hasPrev: paginationValidation.data!.page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching words:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
