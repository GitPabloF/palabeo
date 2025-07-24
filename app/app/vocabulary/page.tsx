"use client"

import { useState } from "react"
import WordCard from "@/components/block/wordCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import CustomPagination from "@/components/block/customPagination"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ShowButton from "@/components/ui/showButton"
import { useUser } from "@/contexts/UserContext"
import { useWords } from "@/hooks/useWords"
import CardSkeleton from "@/components/ui/cardSkeleton"

export default function Vocabulary() {
  const [parent] = useAutoAnimate()
  const { currentUser } = useUser()
  const { words, loading, error, deleteWord } = useWords(currentUser?.id)
  const [showAllTranslation, setShowAllTranslation] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page") || 1)
  const pageSize = 15

  // Filter words by search term
  const filteredWords = words.filter(
    (word) =>
      word.wordFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.wordTo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalWords = filteredWords.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const wordsDisplayed = filteredWords.slice(startIndex, endIndex)

  const filterButtonClass =
    "bg-gray-100 text-black px-3 py-2 hover:bg-brand-orange/10 hover:text-brand-orange text-base"

  /**
   * @description Delete a word from the vocabulary
   * @param id - The id of the word to delete
   */
  const handleDelete = async (id: number) => {
    const success = await deleteWord(id)
    if (!success) {
      console.error("Error deleting word")
    }
  }

  /**
   * @description Transform the word data from the database to the format expected by WordCard
   * @param word - The word data from the database
   * @returns The word data in the format expected by WordCard
   */
  function transformWordForCard(word: any) {
    return {
      id: word.id,
      word: { from: word.wordFrom, to: word.wordTo },
      type: { name: word.typeName, type: word.typeCode },
      lang: { from: word.langFrom, to: word.langTo },
      example: { from: word.exampleFrom, to: word.exampleTo },
      createdAt: word.createdAt,
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
        <div className="flex justify-between items-center mb-6 px-10">
          <h2 className="text-2xl font-bold">My Vocabulary</h2>
          <div className="flex gap-2">
            <div className="relative text-gray-400">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5" />
              </span>
              <Input
                type="text"
                id="word"
                placeholder="Search Words..."
                className="pl-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="bg-brand-orange/90 font-bold hover:bg-brand-orange cursor-pointer disabled:bg-brand-orange/70"
              asChild
            >
              <Link href="/app/add">
                <Image
                  src="/icons/plus.svg"
                  alt="Palabeo"
                  width={14}
                  height={14}
                />
                Add Word
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-10">
          <Card>
            <CardContent className="flex justify-between ">
              <div className="flex items-center gap-4">
                <span className="font-bold">Filter by:</span>
                <div className="flex gap-1.5">
                  <Button className={filterButtonClass}>All Words</Button>
                  <Button className={filterButtonClass}>Recently Added</Button>
                </div>
              </div>
              <ShowButton
                type="multiple"
                showTranslation={showAllTranslation}
                setShowTranslation={setShowAllTranslation}
              />
            </CardContent>
          </Card>
        </div>
        <ScrollArea className="flex-1 flex px-10 mt-7 h-72 rounded-2xl">
          {loading ? (
            <div className="flex-1 flex flex-col gap-5 ">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-5 " ref={parent}>
              {wordsDisplayed.length > 0 ? (
                wordsDisplayed.map((word) => (
                  <WordCard
                    key={word.id}
                    {...transformWordForCard(word)}
                    onDelete={handleDelete}
                    showAllTranslation={showAllTranslation}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <p className="text-lg font-medium">
                    {searchTerm
                      ? "No word found for this search."
                      : "Looks like you haven't added any words. Let's fix that!"}
                  </p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
      <CustomPagination length={totalWords} pageSize={pageSize} index={page} />
    </div>
  )
}
