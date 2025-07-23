"use client"
import Add from "@/components/block/add"
import { useState } from "react"
import { LangCode, Word as WordType } from "@/types/main"
import WordCard from "@/components/block/wordCard"
import CardSkeleton from "@/components/ui/cardSkeleton"
import { useAutoAnimate } from "@formkit/auto-animate/react"

// sample data
const userLanguage: LangCode = "fr"
const leanedLanguage: LangCode = "es"

export default function Words() {
  const [addedWord, setAddedWord] = useState<[] | WordType[]>([])
  const [translatedWord, setTranslatedWord] = useState<null | WordType>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [addedWordsParent] = useAutoAnimate()
  const [translationParent] = useAutoAnimate()

  function handleTranslatedWord(word: WordType | null) {
    setTranslatedWord(word)
  }

  function addWord() {
    if (!translatedWord) return

    setAddedWord((prevWords) => [...prevWords, translatedWord])
  }

  return (
    <div className="max-w-[900px] mx-auto pt-20 h-screen pb-5 flex flex-col gap-6">
      <section id="add">
        <Add
          displayWord={handleTranslatedWord}
          onLoadingChange={setIsLoading}
          addWord={addWord}
          userLanguage={userLanguage}
          leanedLanguage={leanedLanguage}
        />
      </section>

      <div ref={translationParent}>
        {isLoading ? (
          <CardSkeleton />
        ) : (
          translatedWord && <WordCard {...translatedWord} status="pending" />
        )}
      </div>

      {addedWord.length > 0 && (
        <section className="mt-8">
          <h3 className="text-lg font-bold mb-4">Mots ajoutés récemment :</h3>
          <div ref={addedWordsParent} className="flex flex-col gap-4">
            {addedWord
              .slice(-3)
              .reverse()
              .map((word) => (
                <WordCard key={word.id} {...word} />
              ))}
          </div>
        </section>
      )}
    </div>
  )
}
