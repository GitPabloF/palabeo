export type Lang = "fr" | "es"

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
    from: Lang
    to: Lang
  }
  example: {
    from: string
    to: string
  }
  createdAt: string
}
