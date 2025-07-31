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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  from: z.string(),
})

type AddProps = {
  displayWord: (word: Word | null) => void
  onLoadingChange: (loading: boolean) => void
  addWord: () => void
  userLanguage: LangCode
  leanedLanguage: LangCode
}

export default function Add({
  displayWord,
  onLoadingChange,
  addWord,
  userLanguage,
  leanedLanguage,
}: AddProps) {
  const [fromLang, setFromLang] = useState<LangCode>(userLanguage)
  const [toLang, setToLang] = useState<LangCode>(leanedLanguage)
  const [error, setError] = useState<string | null>(null)
  const [translatedWord, setTranslatedWord] = useState<null | Word>(null)
  const [isReversedLang, setIsReversedLang] = useState(false)

  const flagURL = (lang: LangCode) => {
    let langCode = lang.toUpperCase()
    if (langCode === "EN") langCode = "US"
    return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${langCode}.svg`
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from: "",
    },
  })

  const watchedWord = form.watch("from")

  useEffect(() => {
    async function translateWord() {
      setError(null)
      setTranslatedWord(null)
      if (watchedWord && watchedWord.length > 2) {
        try {
          onLoadingChange?.(true)
          const response = await fetch(
            `/api/translate?word=${encodeURIComponent(
              watchedWord
            )}&from=${fromLang}&to=${toLang}&isReversedLang=${isReversedLang}`
          )
          if (!response.ok) {
            onLoadingChange?.(false)
            setError("an error has ocurred")
            return
          }
          const json = await response.json()
          onLoadingChange?.(false)
          const newWord: Word = json.data
          setTranslatedWord(newWord)
        } catch (error) {
          onLoadingChange?.(false)
          console.error("Translation error:", error)
        }
      }
    }
    const timerId = setTimeout(() => {
      translateWord()
    }, 500)

    return () => clearTimeout(timerId)
  }, [watchedWord, form])

  useEffect(() => {
    displayWord(translatedWord)
  }, [translatedWord])

  function onSubmit(values: z.infer<typeof formSchema>) {
    form.reset()
  }

  function resetForm() {
    form.reset()
  }

  function toggleDirection() {
    setIsReversedLang(!isReversedLang)
    setFromLang((prev) =>
      prev === userLanguage ? leanedLanguage : userLanguage
    )
    setToLang((prev) => (prev === userLanguage ? leanedLanguage : userLanguage))
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <img
                          src={flagURL(fromLang)}
                          alt={fromLang}
                          className="w-5 h-5"
                        />
                      </span>
                      <Input
                        type="text"
                        placeholder={`Exemple : ${LANG[fromLang].exemple}`}
                        className="pl-10 h-12 text-base"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4">
              <Button
                type="button"
                variant="ghost"
                className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 self-center flex items-center gap-2"
                onClick={toggleDirection}
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span className="flex items-center gap-1">
                  <span className="font-medium">{fromLang.toUpperCase()}</span>
                  <span className="text-xs">→</span>
                  <span className="font-medium">{toLang.toUpperCase()}</span>
                </span>
              </Button>

              <div className="flex gap-3 w-full">
                <Button
                  className="font-medium cursor-pointer gap-2 flex-1 h-12"
                  variant="outline"
                  disabled={!translatedWord}
                  onClick={resetForm}
                >
                  <X className="w-4 h-4" />
                  <span>Annuler</span>
                </Button>
                <Button
                  className="bg-brand-orange/90 font-medium hover:bg-brand-orange cursor-pointer disabled:bg-brand-orange/70 gap-2 flex-1 h-12"
                  disabled={!translatedWord}
                  onClick={addWord}
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
