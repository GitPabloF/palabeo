import { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import {
  formatTypeName,
  formatTypeCode,
  formatWord,
  formatExemple,
} from "@/utils/formatWord"
import { checkRateLimit } from "@/lib/rate-limit"
import {
  validateTranslateParams,
  createValidationErrorResponse,
} from "@/lib/validation"
export const runtime = "nodejs"

/**
 * Handle GET requests for translating a word using the WordReference API.
 *
 * @param {NextRequest} request - The incoming HTTP request with query parameters.
 * @returns {Promise<NextResponse>} - A JSON response containing the translation data or an error.
 *
 * Expected query parameters:
 * - `word` (required): the word to translate.
 * - `from` (optional): source language code (default is 'es').
 * - `to` (optional): target language code (default is 'fr').
 */
export async function GET(request: NextRequest) {
  // Rate limiting check
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded
    ? forwarded.split(",")[0]
    : request.headers.get("x-real-ip") ?? "127.0.0.1"
  const rateLimitResult = await checkRateLimit(ip)

  if (!rateLimitResult) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    )
  }

  const { searchParams } = new URL(request.url)

  // Validate and sanitize all input parameters
  const validationResult = validateTranslateParams(searchParams)

  if (!validationResult.success) {
    return NextResponse.json(
      createValidationErrorResponse(validationResult.errors),
      { status: 400 }
    )
  }

  const { word, from, to, isReversedLang } = validationResult.data!
  try {
    const proxyBaseUrl = process.env.WORDREFERENCE_PROXY_URL
    if (!proxyBaseUrl) {
      console.error("WORDREFERENCE_PROXY_URL environment variable is not set.")
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      )
    }
    const proxyUrl = `${proxyBaseUrl}/translate?word=${encodeURIComponent(
      word
    )}&from=${from}&to=${to}`
    const res = await fetch(proxyUrl)
    const result = await res.json()

    // formated data (identique à avant)
    const translation = result.translations?.[0]?.translations?.[0]

    if (!translation || !translation.to) {
      return NextResponse.json(
        {
          error: "Could not extract translation from API response.",
        },
        {
          status: 500,
        }
      )
    }

    const wordFrom = isReversedLang ? translation.to : translation.from
    const typeCode = isReversedLang ? translation.fromType : translation.toType
    const wordTo = isReversedLang ? translation.from : translation.to
    const exampleFrom = isReversedLang
      ? translation.example?.to?.[0]
      : translation.example?.from?.[0]
    const exampleTo = isReversedLang
      ? translation.example?.from?.[0]
      : translation.example?.to?.[0]

    const formattedData = {
      wordFrom: formatWord(wordFrom),
      wordTo: formatWord(wordTo),
      typeCode: formatTypeCode(typeCode),
      typeName: formatTypeName(typeCode),
      langFrom: isReversedLang ? to : from,
      langTo: isReversedLang ? from : to,
      exampleFrom: formatExemple(exampleFrom),
      exampleTo: formatExemple(exampleTo),
    }

    return NextResponse.json(
      { message: "sucess", data: formattedData },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: `Server error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    )
  }
}
