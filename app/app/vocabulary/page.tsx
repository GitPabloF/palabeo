"use client"

import Word from "@/components/block/word"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Word as WordType } from "@/types/word"

import { useSearchParams, useRouter } from "next/navigation"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import Image from "next/image"
import Link from "next/link"

export default function Vocabulary() {
  const words: WordType[] = [
    {
      id: 0,
      word: "el Gato",
      translatedWord: "le chat",
      lang: "es",
    },
    {
      id: 1,
      word: "hablar",
      translatedWord: "parler",
      lang: "es",
    },
    {
      id: 1,
      word: "hablar",
      translatedWord: "parler",
      lang: "es",
    },
    {
      id: 1,
      word: "hablar",
      translatedWord: "parler",
      lang: "es",
    },
    {
      id: 1,
      word: "hablar",
      translatedWord: "parler",
      lang: "es",
    },

    {
      id: 1,
      word: "test",
      translatedWord: "test",
      lang: "es",
    },
    {
      id: 1,
      word: "hablar",
      translatedWord: "parler",
      lang: "es",
    },

    {
      id: 1,
      word: "test",
      translatedWord: "test",
      lang: "es",
    },
    {
      id: 1,
      word: "hablar",
      translatedWord: "parler",
      lang: "es",
    },

    {
      id: 1,
      word: "test",
      translatedWord: "test",
      lang: "es",
    },
    {
      id: 1,
      word: "hablar",
      translatedWord: "parler",
      lang: "es",
    },

    {
      id: 1,
      word: "test",
      translatedWord: "test",
      lang: "es",
    },

    {
      id: 1,
      word: "test",
      translatedWord: "test",
      lang: "es",
    },
    {
      id: 1,
      word: "test",
      translatedWord: "test",
      lang: "es",
    },
    {
      id: 1,
      word: "test",
      translatedWord: "test",
      lang: "es",
    },
  ]

  const searchParams = useSearchParams()
  const router = useRouter()
  const page = Number(searchParams.get("page") || 1)
  const pageSize = 10

  const displayPagination = words.length > pageSize

  const totalWords = words.length
  const totalPages = Math.ceil(totalWords / pageSize)

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const wordsDisplayed = words.slice(startIndex, endIndex)

  const getPageNumbers = () => {
    if (totalPages <= 5) return [...Array(totalPages)].map((_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, 4, "...", totalPages]
    if (page >= totalPages - 2)
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    return [1, "...", page - 1, page, page + 1, "...", totalPages]
  }

  function handlePageChange(newPage: number) {
    router.push(`?page=${newPage}`)
  }

  return (
    <div className="max-w-[900px] mx-auto pt-20 h-screen pb-5 flex flex-col gap-6">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex justify-between items-center mb-6 px-10">
          <h2 className="text-xl font-bold">My Vocabulary</h2>
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
        <div className="flex-1 overflow-y-auto flex flex-col gap-5 px-10">
          {wordsDisplayed.map((word, id) => (
            <Word key={id} {...word} />
          ))}
        </div>
      </div>
      {displayPagination && (
        <div className="px-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?page=${page - 1}`}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={i}>
                    <PaginationLink href={`?page=${p}`} isActive={page === p}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href={`?page=${page + 1}`}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
