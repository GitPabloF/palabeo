"use client"
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
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
    form.reset
  }

  function toggleDirection() {
    setIsReversedLang(!isReversedLang)
    setFromLang((prev) =>
      prev === userLanguage ? leanedLanguage : userLanguage
    )
    setToLang((prev) => (prev === userLanguage ? leanedLanguage : userLanguage))
  }

  return (
    <Card className="w-full max-w-[900px]">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Add a new word</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
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
                        placeholder={`ex: ${LANG[fromLang].exemple}`}
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-1.5">
              <Button
                type="button"
                variant="ghost"
                className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 self-start"
                onClick={toggleDirection}
              >
                <span className="flex items-center gap-1">
                  <span>{fromLang}</span>
                  <span className="text-xs">→</span>
                  <span>{toLang}</span>
                </span>
              </Button>

              <div className="flex gap-2 w-full">
                <Button
                  className="font-bold cursor-pointer gap-0 flex-1/2"
                  variant="secondary"
                  disabled={!translatedWord}
                  onClick={resetForm}
                >
                  <span className="ml-2">Cancel</span>
                </Button>
                <Button
                  className="bg-brand-orange/90 font-bold hover:bg-brand-orange cursor-pointer disabled:bg-brand-orange/70 gap-0 flex-1/2"
                  disabled={!translatedWord}
                  onClick={addWord}
                >
                  <Plus size={36} strokeWidth={3} />
                  <span className="ml-2">Add the word</span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
