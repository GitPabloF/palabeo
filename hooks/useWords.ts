import { useState, useEffect } from "react"
import { Word as PrismaWord } from "@/lib/generated/prisma"
import { Word as Word } from "@/types/main"

export function useWords(userId?: string) {
  type Error = {
    message: string
    status?: number
  }

  const [words, setWords] = useState<PrismaWord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function fetchWords() {
    if (!userId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${userId}/words`)
      if (!response.ok) {
        const errorMessage =
          response.status === 404
            ? "Utilisateur non trouvé"
            : response.status === 500
            ? "Erreur serveur"
            : `Erreur ${response.status}: ${response.statusText}`

        setError({ message: errorMessage, status: response.status })
        return
      }
      const data = await response.json()
      setWords(data)
    } catch (error) {
      console.error("Erreur fetchWords:", error)

      setError({
        message: error instanceof Error ? error.message : "Erreur de connexion",
        status: 500,
      })
    } finally {
      setLoading(false)
    }
  }

  async function addWord(word: Word) {
    if (!userId) return false

    const {
      wordFrom,
      wordTo,
      exampleFrom,
      exampleTo,
      langFrom,
      langTo,
      typeCode,
      typeName,
    } = word

    if (
      !wordFrom ||
      !wordTo ||
      !exampleFrom ||
      !exampleTo ||
      !langFrom ||
      !langTo ||
      !typeCode ||
      !typeName
    ) {
      setError({ message: "Missing required fields", status: 400 })
      return false
    }

    try {
      const response = await fetch(`/api/users/${userId}/words`, {
        method: "POST",
        body: JSON.stringify(word),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        let errorMessage: string
        switch (response.status) {
          case 400:
            return "Missing required fields"
          case 409:
            errorMessage = "Word already exists"
            break
          default:
            errorMessage = `Erreur ${response.status}: ${response.statusText}`
        }
        setError({ message: errorMessage, status: response.status })
        return false
      }

      const newWord = await response.json()
      setWords((prev) => [...prev, newWord])
      return true
    } catch (error) {
      console.error("Erreur addWord:", error)
      setError({
        message: error instanceof Error ? error.message : "Erreur de connexion",
        status: 500,
      })
      return false
    }
  }

  async function deleteWord(wordId: number) {
    if (!userId) return false

    try {
      const response = await fetch(`/api/users/${userId}/words/${wordId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorMessage =
          response.status === 404
            ? "Mot non trouvé"
            : response.status === 403
            ? "Vous n'êtes pas autorisé à supprimer ce mot"
            : `Erreur ${response.status}: ${response.statusText}`

        setError({ message: errorMessage, status: response.status })
        return false
      }

      setWords((prev) => prev.filter((word) => word.id !== wordId))
      return true
    } catch (error) {
      console.error("Erreur deleteWord:", error)

      setError({
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la suppression",
        status: 500,
      })
      return false
    }
  }

  const clearError = () => setError(null)

  useEffect(() => {
    if (userId) {
      fetchWords()
    }
  }, [userId])

  return {
    words,
    loading,
    error,
    deleteWord,
    addWord,
    refetch: fetchWords,
    clearError,
  }
}
