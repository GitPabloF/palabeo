import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma, LangCode } from "@/lib/generated/prisma"
import { generateSearchVariations } from "@/utils/string"
import { getServerSession } from "next-auth/next"
import {
  validateWordsSearchParams,
  validateWordCreationData,
  createValidationErrorResponse,
  validateSession,
} from "@/lib/validation"

/**
 * Get words
 * @param request - The request object
 * @returns The words
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    // Validate session with robust validation
    const sessionValidation = validateSession(session)
    if (!sessionValidation.success) {
      return NextResponse.json(
        createValidationErrorResponse(sessionValidation.errors),
        { status: 401 }
      )
    }

    // TODO: Uncomment when can add word / verify if is in the database without this route
    // if (session.user.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    const { searchParams } = new URL(request.url)

    // Validate search parameters
    const validationResult = validateWordsSearchParams(searchParams)
    if (!validationResult.success) {
      return NextResponse.json(
        createValidationErrorResponse(validationResult.errors),
        { status: 400 }
      )
    }

    const {
      langTo,
      langFrom,
      typeCode,
      tag,
      word: searchWord,
    } = validationResult.data!

    const where: Prisma.WordWhereInput = {}

    if (langTo) where.langTo = langTo
    if (langFrom) where.langFrom = langFrom
    if (typeCode) where.typeCode = typeCode
    if (tag) where.tag = tag

    if (searchWord) {
      const variations = generateSearchVariations(searchWord)

      where.OR = variations
        .map((variation) => [
          { wordFrom: { contains: variation, mode: "insensitive" as const } },
          { wordTo: { contains: variation, mode: "insensitive" as const } },
        ])
        .flat()
    }

    const words = await prisma.word.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    // Filter words to be more strict on the length
    const filteredWords = words.filter((word) => {
      if (!searchWord) return true

      const variations = generateSearchVariations(searchWord)

      return variations.some((variation) => {
        const wordFromMatch =
          word.wordFrom.toLowerCase().includes(variation.toLowerCase()) &&
          (word.wordFrom.length === variation.length ||
            word.wordFrom
              .toLowerCase()
              .startsWith(variation.toLowerCase() + "/"))
        const wordToMatch =
          word.wordTo.toLowerCase().includes(variation.toLowerCase()) &&
          (word.wordTo.length === variation.length ||
            word.wordTo.toLowerCase().startsWith(variation.toLowerCase() + "/"))

        return wordFromMatch || wordToMatch
      })
    })

    if (!filteredWords || !filteredWords.length) {
      return NextResponse.json(
        {
          message: "No words found",
          words: [],
        },
        { status: 404 }
      )
    }

    return NextResponse.json(filteredWords)
  } catch (error) {
    console.error("Error fetching words:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Create a new word
 * @param request - The request object
 * @returns The created word
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession()
  // Validate session with robust validation
  const sessionValidation = validateSession(session)
  if (!sessionValidation.success) {
    console.log("sessionValidation", sessionValidation.errors)
    return NextResponse.json(
      createValidationErrorResponse(sessionValidation.errors),
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    const {
      wordFrom,
      wordTo,
      langFrom,
      langTo,
      typeCode,
      tag,
      exampleFrom,
      exampleTo,
      typeName,
    } = body

    const isWordInDatabase = await prisma.word.findFirst({
      where: {
        wordFrom,
        wordTo,
      },
    })

    if (isWordInDatabase) {
      return NextResponse.json(
        { error: "Word already in database" },
        { status: 409 }
      )
    }

    const word = await prisma.word.create({
      data: {
        wordFrom,
        wordTo,
        langFrom,
        langTo,
        typeCode,
        exampleFrom,
        exampleTo,
        typeName,
        ...(tag && { tag }),
      },
    })

    return NextResponse.json(word)
  } catch (error) {
    console.error("Error creating word:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
