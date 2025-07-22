"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
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
  from: z.string().min(1, {
    message: "Please enter a valid word",
  }),
})

type AddProps = {
  displayWord: (word: Word | null) => void
}

export default function Add({ displayWord }: AddProps) {
  // sample gloabl lang data
  const userLanguage = "fr"
  const leanedLanguage = "es"
  //
  const [fromLang, setFromLang] = useState<LangCode>(leanedLanguage)
  const [toLang, setToLang] = useState<LangCode>(userLanguage)
  const [error, setError] = useState<string | null>(null)
  const [translatedWord, setTranslatedWord] = useState<null | Word>(null)

  const flagURL = (lang: LangCode) =>
    `http://purecatamphetamine.github.io/country-flag-icons/3x2/${lang.toUpperCase()}.svg`

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
      if (watchedWord && watchedWord.length > 2) {
        try {
          const response = await fetch(
            `/api/translate?word=${encodeURIComponent(watchedWord)}`
          )
          if (!response.ok) {
            setError("an error has ocurred")
            return
          }
          console.log(response)
          const json = await response.json()
          console.log(json)
          const newWord: Word = json.data
          setTranslatedWord(newWord)
        } catch (error) {
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
    console.log(values)
    form.reset()
  }

  function toggleDirection() {
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

              <Button
                className="bg-brand-orange/90 font-bold hover:bg-brand-orange cursor-pointer disabled:bg-brand-orange/70"
                disabled={!form.formState.isValid}
              >
                <Image
                  src="/icons/plus.svg"
                  alt="Palabeo"
                  width={14}
                  height={14}
                />
                <span className="ml-2">Add Word</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
