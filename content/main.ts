import { Feature, Lang } from "@/types/main"

export const FEATURES: Feature[] = [
  {
    id: 1,
    name: "add words",
    color: "bg-amber-500",
    icon: "plus",
    path: "add",
  },
  {
    id: 2,
    name: "my vocabulary",
    color: "bg-cyan-500",
    icon: "book",
    path: "vocabulary",
  },
  {
    id: 3,
    name: "practice",
    color: "bg-green-400",
    icon: "dumbel",
    path: "practice",
  },
  {
    id: 4,
    name: "progress",
    color: "bg-yellow-300",
    icon: "progress",
    path: "progress",
  },
  {
    id: 5,
    name: "settings",
    color: "bg-gray-300",
    icon: "settings",
    path: "settings",
  },
]

export const WORD_TYPE: Record<string, string> = {
  adj: "adjective",
  nf: "noun feminine",
  nm: "noun masculine",
  vi: "verb intransitive",
  vt: "verb transitive",
  adv: "adverb",
  pron: "pronoun",
}

export const LANG: Record<string, Lang> = {
  fr: {
    name: "french",
    exemple: "bonjour, merci, s'il vous plaît",
  },
  es: {
    name: "spanish",
    exemple: "hola, gracias, por favor",
  },
}
