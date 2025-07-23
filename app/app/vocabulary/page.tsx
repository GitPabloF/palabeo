"use client"

import { useState } from "react"
import WordCard from "@/components/block/wordCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import CustomPagination from "@/components/block/customPagination"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Word as WordType } from "@/types/main"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useSearchParams } from "next/navigation"

import Image from "next/image"
import Link from "next/link"
import ShowButton from "@/components/ui/showButton"

export default function Vocabulary() {
  const [parent] = useAutoAnimate()

  const WORDS: WordType[] = [
    {
      id: 0,
      word: { from: "le chat", to: "el gato" },
      type: { name: "noun masculine", type: "nm" },
      lang: { from: "fr", to: "es" },
      example: { from: "Le chat dort.", to: "El gato duerme." },
      createdAt: "2025-01-01",
    },
    {
      id: 1,
      word: { from: "parler", to: "hablar" },
      type: { name: "verb", type: "vi" },
      lang: { from: "fr", to: "es" },
      example: { from: "J'aime parler.", to: "Me gusta hablar." },
      createdAt: "2025-01-01",
    },
    {
      id: 2,
      word: { from: "manger", to: "comer" },
      type: { name: "verb", type: "vt" },
      lang: { from: "fr", to: "es" },
      example: { from: "Nous allons manger.", to: "Vamos a comer." },
      createdAt: "2025-01-01",
    },
    {
      id: 3,
      word: { from: "boire", to: "beber" },
      type: { name: "verb", type: "vt" },
      lang: { from: "fr", to: "es" },
      example: { from: "Je veux boire de l'eau.", to: "Quiero beber agua." },
      createdAt: "2025-01-01",
    },
    {
      id: 4,
      word: { from: "vivre", to: "vivir" },
      type: { name: "verb", type: "vi" },
      lang: { from: "fr", to: "es" },
      example: { from: "Vivre, c'est apprendre.", to: "Vivir es aprender." },
      createdAt: "2025-01-01",
    },
    {
      id: 5,
      word: { from: "livre", to: "libro" },
      type: { name: "noun masculine", type: "nm" },
      lang: { from: "fr", to: "es" },
      example: { from: "Je lis un livre.", to: "Leo un libro." },
      createdAt: "2025-01-01",
    },
    {
      id: 6,
      word: { from: "table", to: "mesa" },
      type: { name: "noun masculine", type: "nf" },
      lang: { from: "fr", to: "es" },
      example: { from: "La table est grande.", to: "La mesa es grande." },
      createdAt: "2025-01-01",
    },
    {
      id: 7,
      word: { from: "courir", to: "correr" },
      type: { name: "verb", type: "vi" },
      lang: { from: "fr", to: "es" },
      example: { from: "J'aime courir.", to: "Me gusta correr." },
      createdAt: "2025-01-01",
    },
    {
      id: 8,
      word: { from: "rapide", to: "rápido" },
      type: { name: "adjecitve", type: "adj" },
      lang: { from: "fr", to: "es" },
      example: { from: "Il est très rapide.", to: "Es muy rápido." },
      createdAt: "2025-01-01",
    },
    {
      id: 9,
      word: { from: "heureux", to: "feliz" },
      type: { name: "adjecitve", type: "adj" },
      lang: { from: "fr", to: "es" },
      example: { from: "Je suis heureux.", to: "Estoy feliz." },
      createdAt: "2025-01-01",
    },
    {
      id: 10,
      word: { from: "triste", to: "triste" },
      type: { name: "adjecitve", type: "adj" },
      lang: { from: "fr", to: "es" },
      example: { from: "Elle est triste.", to: "Ella está triste." },
      createdAt: "2025-01-01",
    },
    {
      id: 11,
      word: { from: "rapidement", to: "rápidamente" },
      type: { name: "adverb", type: "adj" },
      lang: { from: "fr", to: "es" },
      example: { from: "Il a couru rapidement.", to: "Corrió rápidamente." },
      createdAt: "2025-01-01",
    },
    {
      id: 12,
      word: { from: "garçon", to: "niño" },
      type: { name: "noun masculine", type: "nm" },
      lang: { from: "fr", to: "es" },
      example: { from: "Le garçon joue.", to: "El niño juega." },
      createdAt: "2025-01-01",
    },
    {
      id: 13,
      word: { from: "femme", to: "mujer" },
      type: { name: "noun masculine", type: "nf" },
      lang: { from: "fr", to: "es" },
      example: { from: "La femme parle.", to: "La mujer habla." },
      createdAt: "2025-01-01",
    },
    {
      id: 14,
      word: { from: "joli", to: "bonito" },
      type: { name: "adjecitve", type: "adj" },
      lang: { from: "fr", to: "es" },
      example: { from: "Le tableau est joli.", to: "El cuadro es bonito." },
      createdAt: "2025-01-01",
    },
    {
      id: 15,
      word: { from: "marcher", to: "caminar" },
      type: { name: "verb", type: "vi" },
      lang: { from: "fr", to: "es" },
      example: { from: "Nous aimons marcher.", to: "Nos gusta caminar." },
      createdAt: "2025-01-01",
    },
    {
      id: 16,
      word: { from: "tard", to: "tarde" },
      type: { name: "adverb", type: "adj" },
      lang: { from: "fr", to: "es" },
      example: { from: "Nous sommes arrivés tard.", to: "Llegamos tarde." },
      createdAt: "2025-01-01",
    },
    {
      id: 17,
      word: { from: "nouveau", to: "nuevo" },
      type: { name: "adjecitve", type: "adj" },
      lang: { from: "fr", to: "es" },
      example: { from: "Une voiture neuve.", to: "Un coche nuevo." },
      createdAt: "2025-01-01",
    },
  ]

  const [words, setWords] = useState<WordType[]>(WORDS)
  const [showAllTranslation, setShowAllTranslation] = useState(false)

  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page") || 1)
  const pageSize = 15

  const totalWords = words.length

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const wordsDisplayed = words.slice(startIndex, endIndex)
  const filterButtonClass =
    "bg-gray-100 text-black px-3 py-2 hover:bg-brand-orange/10 hover:text-brand-orange text-base"

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
          <div className="flex-1 flex flex-col gap-5 " ref={parent}>
            {wordsDisplayed.length > 0 ? (
              wordsDisplayed.map((word) => (
                <WordCard
                  key={word.id}
                  {...word}
                  onDelete={handleDelete}
                  showAllTranslation={showAllTranslation}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <p className="text-lg font-medium">
                  Looks like you haven’t added any words. Let’s fix that!
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        {/* </div> */}
      </div>
      <CustomPagination length={totalWords} pageSize={pageSize} index={page} />
    </div>
  )
}
