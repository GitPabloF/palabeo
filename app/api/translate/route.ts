import { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { formatType } from "@/utilis/formatWord"
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
  const { searchParams } = new URL(request.url)
  const word = searchParams.get("word")
  const from = searchParams.get("from") || "es"
  const to = searchParams.get("to") || "fr"
  const isReversedLang = searchParams.get("isReversedLang") === "true"

  if (!word || !from || !to) {
    return NextResponse.json(
      { error: "Missing parameter: 'word' | 'from' | 'to'" },
      { status: 400 }
    )
  }
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
    const wordTo = isReversedLang ? translation.from : translation.to
    const exampleFrom = isReversedLang
      ? translation.example?.to?.[0]
      : translation.example?.from?.[0]
    const exampleTo = isReversedLang
      ? translation.example?.from?.[0]
      : translation.example?.to?.[0]

    const formattedData = {
      id: crypto.randomUUID(),
      word: {
        from: wordFrom,
        to: wordTo,
      },
      type: {
        name: formatType(translation.fromType),
        type: translation.fromType || "unknown",
      },
      lang: {
        from: isReversedLang ? to : from,
        to: isReversedLang ? from : to,
      },
      example: {
        from: exampleFrom || null || translation.example?.from?.[0],
        to: exampleTo || null || translation.example?.to?.[0],
      },
      createdAt: new Date().toISOString().split("T")[0],
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
