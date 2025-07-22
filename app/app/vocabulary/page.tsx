"use client"

import { useState } from "react"
import Word from "@/components/block/word"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import CustomPagination from "@/components/block/customPagination"

import { Word as WordType } from "@/types/main"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useSearchParams } from "next/navigation"

import Image from "next/image"
import Link from "next/link"

export default function Vocabulary() {
  const [parent] = useAutoAnimate()

  const WORDS: WordType[] = [
    {
      id: 0,
      word: { from: "el gato", to: "le chat" },
      type: { name: "noun masculine", type: "nm" },
      lang: { from: "es", to: "fr" },
      example: { from: "El gato duerme.", to: "Le chat dort." },
      createdAt: "2025-01-01",
    },
    {
      id: 1,
      word: { from: "hablar", to: "parler" },
      type: { name: "verb", type: "vi" },
      lang: { from: "es", to: "fr" },
      example: { from: "Me gusta hablar.", to: "J'aime parler." },
      createdAt: "2025-01-01",
    },
    {
      id: 2,
      word: { from: "comer", to: "manger" },
      type: { name: "verb", type: "vt" },
      lang: { from: "es", to: "fr" },
      example: { from: "Vamos a comer.", to: "Nous allons manger." },
      createdAt: "2025-01-01",
    },
    {
      id: 3,
      word: { from: "beber", to: "boire" },
      type: { name: "verb", type: "vt" },
      lang: { from: "es", to: "fr" },
      example: { from: "Quiero beber agua.", to: "Je veux boire de l'eau." },
      createdAt: "2025-01-01",
    },
    {
      id: 4,
      word: { from: "vivir", to: "vivre" },
      type: { name: "verb", type: "vi" },
      lang: { from: "es", to: "fr" },
      example: { from: "Vivir es aprender.", to: "Vivre, c'est apprendre." },
      createdAt: "2025-01-01",
    },
    {
      id: 5,
      word: { from: "libro", to: "livre" },
      type: { name: "noun masculine", type: "nm" },
      lang: { from: "es", to: "fr" },
      example: { from: "Leo un libro.", to: "Je lis un livre." },
      createdAt: "2025-01-01",
    },
    {
      id: 6,
      word: { from: "mesa", to: "table" },
      type: { name: "noun masculine", type: "nf" },
      lang: { from: "es", to: "fr" },
      example: { from: "La mesa es grande.", to: "La table est grande." },
      createdAt: "2025-01-01",
    },
    {
      id: 7,
      word: { from: "correr", to: "courir" },
      type: { name: "verb", type: "vi" },
      lang: { from: "es", to: "fr" },
      example: { from: "Me gusta correr.", to: "J'aime courir." },
      createdAt: "2025-01-01",
    },
    {
      id: 8,
      word: { from: "rápido", to: "rapide" },
      type: { name: "adjecitve", type: "adj" },
      lang: { from: "es", to: "fr" },
      example: { from: "Es muy rápido.", to: "Il est très rapide." },
      createdAt: "2025-01-01",
    },
    {
      id: 9,
      word: { from: "feliz", to: "heureux" },
      type: { name: "adjecitve", type: "adj" },
      lang: { from: "es", to: "fr" },
      example: { from: "Estoy feliz.", to: "Je suis heureux." },
      createdAt: "2025-01-01",
    },
    {
      id: 10,
      word: { from: "triste", to: "triste" },
      type: { name: "adjecitve", type: "adj" },
      lang: { from: "es", to: "fr" },
      example: { from: "Ella está triste.", to: "Elle est triste." },
      createdAt: "2025-01-01",
    },
    {
      id: 11,
      word: { from: "rápidamente", to: "rapidement" },
      type: { name: "adverb", type: "adj" },
      lang: { from: "es", to: "fr" },
      example: { from: "Corrió rápidamente.", to: "Il a couru rapidement." },
      createdAt: "2025-01-01",
    },
    {
      id: 12,
      word: { from: "niño", to: "garçon" },
      type: { name: "noun masculine", type: "nm" },
      lang: { from: "es", to: "fr" },
      example: { from: "El niño juega.", to: "Le garçon joue." },
      createdAt: "2025-01-01",
    },
    {
      id: 13,
      word: { from: "mujer", to: "femme" },
      type: { name: "noun masculine", type: "nf" },
      lang: { from: "es", to: "fr" },
      example: { from: "La mujer habla.", to: "La femme parle." },
      createdAt: "2025-01-01",
    },
    {
      id: 14,
      word: { from: "bonito", to: "joli" },
      type: { name: "adjecitve", type: "adj" },
      lang: { from: "es", to: "fr" },
      example: { from: "El cuadro es bonito.", to: "Le tableau est joli." },
      createdAt: "2025-01-01",
    },
    {
      id: 15,
      word: { from: "caminar", to: "marcher" },
      type: { name: "verb", type: "vi" },
      lang: { from: "es", to: "fr" },
      example: { from: "Nos gusta caminar.", to: "Nous aimons marcher." },
      createdAt: "2025-01-01",
    },
    {
      id: 16,
      word: { from: "tarde", to: "tard" },
      type: { name: "adverb", type: "adj" },
      lang: { from: "es", to: "fr" },
      example: { from: "Llegamos tarde.", to: "Nous sommes arrivés tard." },
      createdAt: "2025-01-01",
    },
    {
      id: 17,
      word: { from: "nuevo", to: "nouveau" },
      type: { name: "adjecitve", type: "adj" },
      lang: { from: "es", to: "fr" },
      example: { from: "Un coche nuevo.", to: "Une voiture neuve." },
      createdAt: "2025-01-01",
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
          {wordsDisplayed.length > 0 ? (
            wordsDisplayed.map((word) => (
              <Word key={word.id} {...word} onDelete={handleDelete} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <p className="text-lg font-medium">
                Looks like you haven’t added any words. Let’s fix that!
              </p>
            </div>
          )}
        </div>
      </div>
      <CustomPagination length={totalWords} pageSize={pageSize} index={page} />
    </div>
  )
}
