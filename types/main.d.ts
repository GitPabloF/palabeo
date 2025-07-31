import { LANG, WORD_TYPE } from "@/content/main"

export type Feature = {
  id: number
  name: string
  color: string
  icon: string
  path: string
}

// LANG
export type Lang = {
  name: string
  exemple: string
}

export type LangCode = keyof typeof LANG

export type WordTypeCode = keyof typeof WORD_TYPE

// WORD
export type Word = {
  id: number
  wordFrom: string
  wordTo: string
  typeCode: string
  typeName: string
  langFrom: LangCode
  langTo: LangCode
  exampleFrom: string
  exampleTo: string
  createdAt: string | Date
}

export type Question = {
  questionNumber: number
  word: string
  answer: string
  options: string[]
}
