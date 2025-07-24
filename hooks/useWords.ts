import { useState, useEffect } from "react"
import { Word } from "@/lib/generated/prisma"

export function useWords(userId?: string) {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

        setError(errorMessage)
        return
      }
      const data = await response.json()
      setWords(data)
    } catch (error) {
      console.error("Erreur fetchWords:", error)

      setError(error instanceof Error ? error.message : "Erreur de connexion")
    } finally {
      setLoading(false)
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

        setError(errorMessage)
        return false
      }

      setWords((prev) => prev.filter((word) => word.id !== wordId))
      return true
    } catch (error) {
      console.error("Erreur deleteWord:", error)

      setError(
        error instanceof Error ? error.message : "Erreur lors de la suppression"
      )
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
    refetch: fetchWords,
    clearError,
  }
}
