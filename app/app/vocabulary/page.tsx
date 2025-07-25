"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@/contexts/UserContext"
import { useWords } from "@/hooks/useWords"
import { useSearch } from "@/hooks/useSearch"
import { usePagination } from "@/hooks/usePagination"
import { VocabularyHeader } from "@/components/vocabulary/VocabularyHeader"
import { VocabularyFilters } from "@/components/vocabulary/VocabularyFilters"
import { VocabularyList } from "@/components/vocabulary/VocabularyList"
import CustomPagination from "@/components/block/customPagination"

export default function Vocabulary() {
  const { currentUser } = useUser()
  const { words, loading, error, deleteWord } = useWords(currentUser?.id)
  const [showAllTranslation, setShowAllTranslation] = useState(false)

  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page") || 1)
  const pageSize = 15

  // ✅ Utilisation des hooks spécialisés
  const { searchTerm, setSearchTerm, filteredItems } = useSearch({
    items: words,
    searchFields: ["wordFrom", "wordTo"],
  })

  const { paginatedItems, totalPages } = usePagination({
    items: filteredItems,
    pageSize,
    currentPage,
  })

  const handleDelete = async (id: number) => {
    const success = await deleteWord(id)
    if (!success) {
      console.error("Error deleting word")
    }
  }

  if (error) {
    return (
      <div className="max-w-[900px] mx-auto pt-20 h-screen pb-5 flex flex-col gap-6">
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">Erreur: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[900px] mx-auto pt-20 h-screen pb-5 flex flex-col gap-6">
      <div className="flex flex-col flex-1 min-h-0">
        <VocabularyHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <VocabularyFilters
          showAllTranslation={showAllTranslation}
          onShowTranslationChange={setShowAllTranslation}
        />

        <ScrollArea className="flex-1 flex px-10 mt-7 h-72 rounded-2xl">
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
  )
}
