"use client"
import Add from "@/components/block/add"
import { useState } from "react"
import { Word } from "@/types/main"
import { useUser } from "@/contexts/UserContext"
import { useWords } from "@/hooks/useWords"
import { Plus } from "lucide-react"
import PageHeader from "@/components/block/pageHeader"
import { VocabularyList } from "@/components/vocabulary/VocabularyList"

export default function AddPage() {
  const [translatedWord, setTranslatedWord] = useState<null | Word>(null)

  const { currentUser } = useUser()
  const { addWord, words, loading } = useWords(currentUser?.id)

  function handleTranslatedWord(word: Word | null) {
    setTranslatedWord(word)
  }

  const recentlyAddedWords = words.slice(-6).reverse()

  async function handleAdd() {
    if (!translatedWord) return
    console.log("translatedWord", translatedWord)

    await addWord(translatedWord)
  }

  if (!currentUser) {
    return <div>You need to be logged in to add words</div>
  }

  return (
    <>
      <PageHeader
        title="Add a word"
        description="Develop your card collection"
        colorType="nm"
        icon={Plus}
      />

      {/* Add Word Form */}
      <section id="add" className="mb-8">
        <Add
          displayWord={handleTranslatedWord}
          addWord={handleAdd}
          userId={currentUser?.id}
          userLanguage={currentUser?.userLanguage}
          leanedLanguage={currentUser?.learnedLanguage}
        />
      </section>

      {/* Recently Added Words */}
      {words.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-center text-slate-700 mb-4">
            Recently added words:
          </h3>

          <VocabularyList words={recentlyAddedWords} loading={loading} />
        </section>
      )}
    </>
  )
}
