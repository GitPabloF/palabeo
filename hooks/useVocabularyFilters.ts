import { useState, useMemo } from "react"
import { Word as PrismaWord } from "@/lib/generated/prisma"

type SortOption = "alphabetical" | "recentlyAdded"

export function useVocabularyFilters({ words }: { words: PrismaWord[] }) {
  const [sortBy, setSortBy] = useState<SortOption>("recentlyAdded")

  const sortedWords = useMemo(() => {
    const items = [...words]

    switch (sortBy) {
      case "alphabetical":
        return items.sort((a, b) => a.wordFrom.localeCompare(b.wordFrom))
      case "recentlyAdded":
        return items.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0)
          const dateB = new Date(b.createdAt || 0)
          return dateB.getTime() - dateA.getTime()
        })
      default:
        return items
    }
  }, [words, sortBy])

  return {
    sortBy,
    sortedWords,
    setSortBy,
  }
}
