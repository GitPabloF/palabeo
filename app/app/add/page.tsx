"use client"
import Add from "@/components/block/add"
import { useState } from "react"
import { LangCode, Word as WordType } from "@/types/main"
import WordCard from "@/components/block/wordCard"
import CardSkeleton from "@/components/ui/cardSkeleton"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useUser } from "@/contexts/UserContext"
import { useWords } from "@/hooks/useWords"

export default function Words() {
  const [addedWord, setAddedWord] = useState<[] | WordType[]>([])
  const [translatedWord, setTranslatedWord] = useState<null | WordType>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { currentUser } = useUser()
  const { addWord, error } = useWords(currentUser?.id)

  const [addedWordsParent] = useAutoAnimate()
  const [translationParent] = useAutoAnimate()

  function handleTranslatedWord(word: WordType | null) {
    setTranslatedWord(word)
  }

  async function handleAdd() {
    if (!translatedWord) return

    const result = await addWord(translatedWord)
    if (result) {
      setAddedWord((prev) => [...prev, translatedWord])
    }
  }

  if (!currentUser) {
    return <div>You need to be logged in to add words</div>
  }

  return (
    <>
      <section id="add">
        <Add
          displayWord={handleTranslatedWord}
          onLoadingChange={setIsLoading}
          addWord={handleAdd}
          userLanguage={currentUser?.userLanguage}
          leanedLanguage={currentUser?.learnedLanguage}
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
    </>
  )
}
