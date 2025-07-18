"use client"

import { useState } from "react"
import Word from "@/components/block/word"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import CustomPagination from "@/components/block/customPagination"
import { Word as WordType } from "@/types/word"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import { useSearchParams } from "next/navigation"

import Image from "next/image"
import Link from "next/link"

export default function Vocabulary() {
  const [parent] = useAutoAnimate()

  const WORDS: WordType[] = [
    {
      id: 0,
      word: "el gato",
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
      id: 2,
      word: "comer",
      translatedWord: "manger",
      lang: "es",
    },
    {
      id: 3,
      word: "beber",
      translatedWord: "boire",
      lang: "es",
    },
    {
      id: 4,
      word: "vivir",
      translatedWord: "vivre",
      lang: "es",
    },
    {
      id: 5,
      word: "libro",
      translatedWord: "livre",
      lang: "es",
    },
    {
      id: 6,
      word: "escuela",
      translatedWord: "école",
      lang: "es",
    },
    {
      id: 7,
      word: "amigo",
      translatedWord: "ami",
      lang: "es",
    },
    {
      id: 8,
      word: "familia",
      translatedWord: "famille",
      lang: "es",
    },
    {
      id: 9,
      word: "casa",
      translatedWord: "maison",
      lang: "es",
    },
    {
      id: 10,
      word: "perro",
      translatedWord: "chien",
      lang: "es",
    },
    {
      id: 11,
      word: "ciudad",
      translatedWord: "ville",
      lang: "es",
    },
    {
      id: 12,
      word: "coche",
      translatedWord: "voiture",
      lang: "es",
    },
    {
      id: 13,
      word: "sol",
      translatedWord: "soleil",
      lang: "es",
    },
    {
      id: 14,
      word: "noche",
      translatedWord: "nuit",
      lang: "es",
    },
    {
      id: 15,
      word: "agua",
      translatedWord: "eau",
      lang: "es",
    },
    {
      id: 16,
      word: "fuego",
      translatedWord: "feu",
      lang: "es",
    },
    {
      id: 17,
      word: "árbol",
      translatedWord: "arbre",
      lang: "es",
    },
  ]

  const [words, setWords] = useState<WordType[]>(WORDS)

  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page") || 1)
  const pageSize = 15

  const totalWords = words.length

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const wordsDisplayed = words.slice(startIndex, endIndex)

  /**
   * @description Delete a word from the vocabulary
   * @param id - The id of the word to delete
   */
  const handleDelete = (id: number) => {
    setWords(words.filter((word) => word.id != id))
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
        <div
          ref={parent}
          className="flex-1 overflow-y-auto flex flex-col gap-5 px-10"
        >
          {wordsDisplayed.map((word) => (
            <Word key={word.id} {...word} onDelete={handleDelete} />
          ))}
        </div>
      </div>
      <CustomPagination length={totalWords} pageSize={pageSize} index={page} />
    </div>
  )
}
