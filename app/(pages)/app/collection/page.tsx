"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@/contexts/UserContext"
import { useWords } from "@/hooks/useWords"
import { useSearch } from "@/hooks/useSearch"
import { usePagination } from "@/hooks/usePagination"
import { VocabularyHeader } from "@/components/vocabulary/VocabularyHeader"
import {
  VocabularyFilters,
  SortOption,
} from "@/components/vocabulary/VocabularyFilters"
import { VocabularyList } from "@/components/vocabulary/VocabularyList"
import CustomPagination from "@/components/block/customPagination"

export default function Vocabulary() {
  const { currentUser } = useUser()
  const { words, loading, error, deleteWord } = useWords(currentUser?.id)
  const [showAllTranslation, setShowAllTranslation] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("recentlyAdded")

  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page") || 1)
  const pageSize = 15

  const { searchTerm, setSearchTerm, filteredItems } = useSearch({
    items: words,
    searchFields: ["wordFrom", "wordTo"],
  })

  // Apply sorting
  const sortedItems = useMemo(() => {
    const items = [...filteredItems]

    if (sortBy === "alphabetical") {
      return items.sort((a, b) => a.wordFrom.localeCompare(b.wordFrom))
    } else if (sortBy === "recentlyAdded") {
      return items.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      })
    }

    return items
  }, [filteredItems, sortBy])

  const { paginatedItems, totalPages } = usePagination({
    items: sortedItems,
    pageSize,
    currentPage,
  })

  async function handleDelete(id: number) {
    const success = await deleteWord(id)
    if (!success) {
      console.error("Error deleting word")
    }
  }

  if (error) {
    return (
      <div className="max-w-[900px] mx-auto pt-20 h-screen pb-5 flex flex-col gap-6">
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">Erreur: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <VocabularyHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {paginatedItems.length > 0 && (
          <VocabularyFilters
            showAllTranslation={showAllTranslation}
            onShowTranslationChange={setShowAllTranslation}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full rounded-2xl">
            <VocabularyList
              words={paginatedItems}
              loading={loading}
              onDelete={handleDelete}
              showAllTranslation={showAllTranslation}
            />
          </ScrollArea>
        </div>

        <CustomPagination
          length={filteredItems.length}
          pageSize={pageSize}
          index={currentPage}
        />
      </div>
    </>
  )
}
