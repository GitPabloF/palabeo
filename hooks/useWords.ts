import { useState, useEffect } from "react"
import { Word as PrismaWord, UserWord } from "@/lib/generated/prisma"
import { Word as Word } from "@/types/main"
import type { Error } from "@/types/response"
import { apiRequest } from "@/utils/fetch"

export function useWords(userId?: string) {
  const [words, setWords] = useState<PrismaWord[]>([])
  const [loading, setLoading] = useState(false)
  const [addingWord, setAddingWord] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function fetchWords() {
    if (!userId) return

    setLoading(true)
    setError(null)

    try {
      const response = await apiRequest(`/api/users/${userId}/words`)
      if (response) {
        setWords(response.data)
      }
    } catch (error) {
      setError({
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching words",
        status: 500,
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Validate word
   * @param word - The word to validate
   * @returns True if the word is valid, false otherwise
   */
  const validateWord = (word: Word): boolean => {
    const requiredFields = [
      word.wordFrom,
      word.wordTo,
      word.exampleFrom,
      word.exampleTo,
      word.langFrom,
      word.langTo,
      word.typeCode,
      word.typeName,
    ]

    if (requiredFields.some((field) => !field)) {
      setError({ message: "All fields are required", status: 400 })
      return false
    }

    return true
  }

  /**
   * Add a word to the user
   * If the word has an ID, check if it exists in the database
   * If the word does not have an ID, create a new word and add it to the user
   * @param word - The word to add
   * @returns True if the word is added, false otherwise
   */
  async function addWord(word: Word) {
    if (!userId) return false

    if (!validateWord(word)) {
      setError({ message: "All fields are required", status: 400 })
      false
    }

    setLoading(true)

    const { id: wordId } = word

    try {
      // Case 1: The word has an ID - check if it exists
      if (wordId) {
        const wordData = await apiRequest(`/api/words/${wordId}`)

        if (wordData) {
          // Verify if the user already has this word
          const isAlreadyAdded = wordData.userWords.some(
            (userWord: UserWord) => userWord.userId === userId
          )

          if (isAlreadyAdded) {
            setError({ message: "Word already added", status: 401 })
            return false
          }

          // Add the word to the user
          const addResult = await apiRequest(
            `/api/users/${userId}/words/${wordId}`,
            {
              method: "POST",
            }
          )

          if (addResult) {
            setWords((prev) => [...prev, wordData])
            return true
          }
        } else {
          // The word does not exist, create it
          return await createNewWord(word)
        }
      } else {
        // Case 2: No ID - create a new word
        return await createNewWord(word)
      }
    } catch (error) {
      console.error("Erreur addWord:", error)
      setError({
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while adding the word",
        status: 500,
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  /**
   * Create a new word
   * @param word - The word to create
   * @returns True if the word is created, false otherwise
   */
  const createNewWord = async (word: Word): Promise<boolean> => {
    const newWord = await apiRequest(`/api/words`, {
      method: "POST",
      body: JSON.stringify(word),
    })

    if (newWord) {
      const addResult = await apiRequest(
        `/api/users/${userId}/words/${newWord.id}`,
        {
          method: "POST",
        }
      )

      if (addResult) {
        setWords((prev) => [...prev, newWord])
        return true
      }
    }
    setError({
      message: "An error occurred while adding the word",
      status: 500,
    })
    return false
  }

  async function deleteWord(wordId: number) {
    if (!userId) return false

    try {
      const result = await apiRequest(`/api/users/${userId}/words/${wordId}`, {
        method: "DELETE",
      })

      if (result !== null) {
        setWords((prev) => prev.filter((word) => word.id !== wordId))
        return true
      }
      return false
    } catch (error) {
      console.error("Erreur deleteWord:", error)
      setError({
        message: error instanceof Error ? error.message : "Erreur de connexion",
        status: 500,
      })
      return false
    }
  }

  const clearError = () => setError(null)

  useEffect(() => {
    fetchWords()
  }, [userId])

  return {
    words,
    loading,
    addingWord,
    error,
    addWord,
    deleteWord,
    clearError,
    refetch: fetchWords,
  }
}
