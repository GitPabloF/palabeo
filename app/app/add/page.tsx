"use client"
import Add from "@/components/block/add"
import { useState } from "react"
import { LangCode, Word as WordType } from "@/types/main"
import Word from "@/components/block/word"

export default function Words() {
  const [translatedWord, setTranslatedWord] = useState<null | WordType>(null)

  const handleTranslatedWord = (word: WordType | null) => {
    setTranslatedWord(word)
    console.log("Reçu du composant enfant :", word)
  }
  return (
    <div className="px-10 pt-20 pb-40 flex justify-center flex-col gap-25">
      <section id="add">
        <Add displayWord={handleTranslatedWord} />
      </section>
      {translatedWord && <Word {...translatedWord} />}
    </div>
  )
}
