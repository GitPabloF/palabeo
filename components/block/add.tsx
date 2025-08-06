"use client"
import { useState, useEffect } from "react"
import { Plus, ArrowRightLeft, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { LangCode, Word } from "@/types/main"
import { LANG } from "@/content/main"
import { getFlagURL } from "@/utils/getFlag"
import WordCard from "@/components/block/wordCard/wordCard"
import CardSkeleton from "@/components/ui/cardSkeleton"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useTranslate } from "@/hooks/useTranslate"
import LangToogler from "@/components/block/LangToogler"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  value: z.string(),
})

type AddProps = {
  displayWord: (word: Word | null) => void
  addWord: (word: Word) => void
  userId: string
  userLanguage: LangCode
  leanedLanguage: LangCode
}

export default function Add({
  displayWord,
  addWord,
  userLanguage,
  leanedLanguage,
  userId,
}: AddProps) {
  const [parent] = useAutoAnimate()

  const [fromLang, setFromLang] = useState<LangCode>(userLanguage)
  const [toLang, setToLang] = useState<LangCode>(leanedLanguage)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  })

  const watchedWord = form.watch("value")

  /*
   * IF the word is in the database, return the word data
   * IF the word is NOT in the database, translate the word data
   * return the word data
   */
  const { error, wordData, setWordData, isLoading } = useTranslate(
    watchedWord,
    userId,
    fromLang,
    toLang
  )

  // Display the word data when it's available
  useEffect(() => {
    displayWord(wordData)
  }, [wordData, displayWord])

  /**
   * Emit the word data to the parent component and reset the form
   */
  function handleAddWord() {
    if (wordData) {
      addWord(wordData)
      resetForm()
    }
  }

  function resetForm() {
    form.reset()
    setWordData(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (wordData) {
        handleAddWord()
      }
    }
  }

  return (
    <Card className="w-full shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold  text-slate-700">
          What word do you want to add ?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <img
                          src={getFlagURL(fromLang)}
                          alt={fromLang}
                          className="w-5 h-5"
                        />
                      </span>
                      <Input
                        type="text"
                        placeholder={`Exemple : ${LANG[fromLang].exemple}`}
                        className="pl-10 h-12 text-base"
                        {...field}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4" ref={parent}>
              <LangToogler
                fromLang={fromLang}
                toLang={toLang}
                setFromLang={setFromLang}
                setToLang={setToLang}
              />

              {/* Translation Preview */}
              {isLoading && !wordData && (
                <div className="py-4 flex justify-center">
                  <div className="w-full max-w-sm">
                    <CardSkeleton />
                  </div>
                </div>
              )}

              {wordData && (
                <div className="py-4 flex justify-center">
                  <div className="w-full max-w-[280px]">
                    <WordCard {...wordData} status="pending" />
                  </div>
                </div>
              )}

              <div className="flex gap-3 w-full">
                <Button
                  className="font-medium cursor-pointer gap-2 flex-1 h-12"
                  variant="outline"
                  disabled={!wordData}
                  onClick={resetForm}
                >
                  <X className="w-4 h-4" />
                  <span>Annuler</span>
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-orange/90 font-medium hover:bg-brand-orange cursor-pointer disabled:bg-brand-orange/70 gap-2 flex-1 h-12"
                  disabled={isLoading || !wordData}
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter le mot</span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
