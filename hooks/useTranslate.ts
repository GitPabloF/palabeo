import { useState, useEffect } from "react"
import type { Error } from "@/types/response"
import type { Word } from "@/types/main"

export function useTranslate(
  word: string,
  userId: string,
  langFrom: string,
  langTo: string
) {
  const [error, setError] = useState<Error | null>(null)
  const [wordData, setWordData] = useState<Word | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Reset word data when input is too short
    if (word.length < 2) {
      setWordData(null)
      return
    }

    // Set a minimum delay before searching
    const timerId = setTimeout(() => {
      translateWord()
    }, 700)

    return () => clearTimeout(timerId)
  }, [word, langFrom, langTo])

  async function translateWord() {
    setError(null)
    setWordData(null)
    setIsLoading(true)

    if (!userId) {
      setIsLoading(false)
      setError({ message: "User ID is required", status: 400 })
      return false
    }

    if (!word) {
      setIsLoading(false)
      setError({ message: "Word is required", status: 400 })
      return false
    }

    if (!langFrom || !langTo) {
      setIsLoading(false)
      setError({ message: "Language is required", status: 400 })
      return false
    }

    try {
      // 1. Check if the word exists in the database
      const searchResponse = await fetch(
        `/api/words?word=${word}&langFrom=${langFrom}&langTo=${langTo}`
      )

      if (searchResponse.ok) {
        const existingWords = await searchResponse.json()

        // If we find an exact match, we use it
        const exactMatch = existingWords.find(
          (w: Word) =>
            w.wordFrom.toLowerCase() === word.toLowerCase() &&
            w.langFrom === langFrom &&
            w.langTo === langTo
        )

        if (exactMatch) {
          setWordData(exactMatch)
          setIsLoading(false)
          return true
        }
      }

      // 2. If the word is not in the database, translate it
      const translateResponse = await fetch(
        `/api/translate?word=${word}&from=${langFrom}&to=${langTo}`
      )

      if (!translateResponse.ok) {
        setIsLoading(false)
        setError({ message: "Error translating word", status: 500 })
        return false
      }

      const translatedWord = await translateResponse.json()
      if (!translatedWord.data) {
        setIsLoading(false)
        setError({ message: "Error translating word", status: 500 })
        return false
      }

      // The translated word has no ID (not yet in the database)
      setWordData(translatedWord.data)
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      setError({ message: "Error checking word", status: 500 })
      return false
    }
  }

  return { error, wordData, setWordData, isLoading }
}
