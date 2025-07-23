"use client"
import Add from "@/components/block/add"
import { useState } from "react"
import { LangCode, Word as WordType } from "@/types/main"
import WordCard from "@/components/block/wordCard"
import CardSkeleton from "@/components/ui/cardSkeleton"

export default function Words() {
  const [translatedWord, setTranslatedWord] = useState<null | WordType>(null)

  const handleTranslatedWord = (word: WordType | null) => {
    setTranslatedWord(word)
    console.log("Reçu du composant enfant :", word)
  }
  return (
    <div className="max-w-[900px] mx-auto pt-20 h-screen pb-5 flex flex-col gap-6">
      <section id="add">
        <Add displayWord={handleTranslatedWord} />
      </section>
      {translatedWord && <WordCard {...translatedWord} status="pending" />}
    </div>
  )
}
