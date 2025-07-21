export type Word = {
  id: number
  word: string
  translatedWord: string
  type: "noun" | "verb" | "adjecitve"
  lang: "fr" | "es"
  createdAt: string
}
