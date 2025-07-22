import { LANG } from "@/content/main"

export type LangCode = keyof typeof LANG

export type Word = {
  id: number
  word: {
    from: string
    to: string
  }
  type: {
    name: "noun masculine" | "verb" | "adjecitve" | "noun masculine" | "adverb"
    type: "adj" | "nf" | "nm" | "nm" | "vi" | "vt"
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
