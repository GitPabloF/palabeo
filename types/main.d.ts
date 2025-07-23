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
export type WordTypeName = (typeof WORD_TYPE)[WordTypeCode]

// WORD
export type Word = {
  id: number
  word: {
    from: string
    to: string
  }
  type: {
    name: WordTypeName
    type: WordTypeCode
  }
  lang: {
    from: LangCode
    to: LangCode
  }
  example: {
    from: string
    to: string
  }
  createdAt: string
}
