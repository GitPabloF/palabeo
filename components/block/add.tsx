"use client"

import Image from "next/image"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

const formSchema = z.object({
  word: z.string().min(1, {
    message: "Please enter a valide word",
  }),
  translatedWord: z.string().min(1, {
    message: "Please enter a valide word",
  }),
})

export default function Add() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: "",
      translatedWord: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    form.reset()
  }

  return (
    <Card className="w-full max-w-[900px]">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Add a new Spanish word
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spanish Word</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <img
                          src="http://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg"
                          alt="ES"
                          className="w-5 h-5"
                        />
                      </span>
                      <Input
                        type="text"
                        id="word"
                        placeholder="ex: hola, gracias, por favor"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="translatedWord"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>French Word</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <img
                          src="http://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg"
                          alt="FR"
                          className="w-5 h-5"
                        />
                      </span>
                      <Input
                        type="text"
                        id="translatedWord"
                        placeholder="ex: bonjour, merci, s'il vous plaît"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              Add Word
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
