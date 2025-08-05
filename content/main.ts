import { Feature, Lang, Word, Question } from "@/types/main"
import { Plus, Library, Sword, Settings } from "lucide-react"

export const sampleQuestions: Question[] = [
  {
    questionNumber: 1,
    word: "falda",
    answer: "skirt",
    options: ["skirt", "pants", "shorts", "dress"],
  },
  {
    questionNumber: 2,
    word: "zapato",
    answer: "shoe",
    options: ["shoe", "boot", "sandals", "slipper"],
  },
  {
    questionNumber: 3,
    word: "sombrero",
    answer: "hat",
    options: ["hat", "cap", "glove", "scarf"],
  },
  {
    questionNumber: 4,
    word: "casa",
    answer: "house",
    options: ["house", "car", "bike", "train"],
  },
  {
    questionNumber: 5,
    word: "coche",
    answer: "car",
    options: ["car", "bike", "train", "plane"],
  },
  {
    questionNumber: 6,
    word: "casa",
    answer: "house",
    options: ["house", "car", "bike", "train"],
  },
]

export const FEATURES: Feature[] = [
  {
    id: 1,
    name: "add words",
    description: "Develop your collection",
    color: "nm",
    icon: Plus,
    path: "add",
    route: "/app/add",
  },
  {
    id: 2,
    name: "collection",
    description: "All your words",
    color: "adj",
    icon: Library,
    path: "collection",
    route: "/app/collection",
  },
  {
    id: 3,
    name: "practice",
    description: "Master your words",
    color: "v",
    icon: Sword,
    path: "practice",
    route: "/app/practice",
  },
  {
    id: 4,
    name: "settings",
    color: "x",
    icon: Settings,
    path: "settings",
    route: "/app/settings",
  },
]

export const WORD_TYPE: Record<string, { name: string; associated: string[] }> =
  {
    adj: {
      name: "adjective",
      associated: ["adj", "adv", "pron", "adj mf", "adj m", "adj f", "adj inv"],
    },
    adv: {
      name: "adverb",
      associated: ["adv"],
    },
    pron: {
      name: "pronoun",
      associated: ["pron"],
    },
    prep: {
      name: "preposition",
      associated: ["prep", "loc prep"],
    },
    nf: {
      name: "noun (f)",
      associated: ["nf", "nfpl"],
    },
    nm: {
      name: "noun (m)",
      associated: ["nm", "nmpl"],
    },
    nmf: {
      name: "noun (m,f)",
      associated: ["nm, nf"],
    },
    n: {
      name: "noun",
      associated: ["n", "n amb"],
    },
    v: {
      name: "verb",
      associated: ["vi", "vt", "vti", "vtt", "v", "vtr", "v prnl"],
    },
    conj: {
      name: "conjunction",
      associated: ["conj"],
    },
    interj: {
      name: "interjection",
      associated: ["interj"],
    },
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
  en: {
    name: "english",
    exemple: "hello, thank you, please",
  },
}

// const WORDS: Word[] = [
//   {
//     id: 0,
//     word: { from: "le chat", to: "el gato" },
//     type: { name: "noun masculine", type: "nm" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Le chat dort.", to: "El gato duerme." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 1,
//     word: { from: "parler", to: "hablar" },
//     type: { name: "verb", type: "vi" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "J'aime parler.", to: "Me gusta hablar." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 2,
//     word: { from: "manger", to: "comer" },
//     type: { name: "verb", type: "vt" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Nous allons manger.", to: "Vamos a comer." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 3,
//     word: { from: "boire", to: "beber" },
//     type: { name: "verb", type: "vt" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Je veux boire de l'eau.", to: "Quiero beber agua." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 4,
//     word: { from: "vivre", to: "vivir" },
//     type: { name: "verb", type: "vi" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Vivre, c'est apprendre.", to: "Vivir es aprender." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 5,
//     word: { from: "livre", to: "libro" },
//     type: { name: "noun masculine", type: "nm" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Je lis un livre.", to: "Leo un libro." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 6,
//     word: { from: "table", to: "mesa" },
//     type: { name: "noun masculine", type: "nf" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "La table est grande.", to: "La mesa es grande." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 7,
//     word: { from: "courir", to: "correr" },
//     type: { name: "verb", type: "vi" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "J'aime courir.", to: "Me gusta correr." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 8,
//     word: { from: "rapide", to: "rápido" },
//     type: { name: "adjecitve", type: "adj" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Il est très rapide.", to: "Es muy rápido." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 9,
//     word: { from: "heureux", to: "feliz" },
//     type: { name: "adjecitve", type: "adj" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Je suis heureux.", to: "Estoy feliz." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 10,
//     word: { from: "triste", to: "triste" },
//     type: { name: "adjecitve", type: "adj" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Elle est triste.", to: "Ella está triste." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 11,
//     word: { from: "rapidement", to: "rápidamente" },
//     type: { name: "adverb", type: "adj" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Il a couru rapidement.", to: "Corrió rápidamente." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 12,
//     word: { from: "garçon", to: "niño" },
//     type: { name: "noun masculine", type: "nm" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Le garçon joue.", to: "El niño juega." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 13,
//     word: { from: "femme", to: "mujer" },
//     type: { name: "noun masculine", type: "nf" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "La femme parle.", to: "La mujer habla." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 14,
//     word: { from: "joli", to: "bonito" },
//     type: { name: "adjecitve", type: "adj" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Le tableau est joli.", to: "El cuadro es bonito." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 15,
//     word: { from: "marcher", to: "caminar" },
//     type: { name: "verb", type: "vi" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Nous aimons marcher.", to: "Nos gusta caminar." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 16,
//     word: { from: "tard", to: "tarde" },
//     type: { name: "adverb", type: "adj" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Nous sommes arrivés tard.", to: "Llegamos tarde." },
//     createdAt: "2025-01-01",
//   },
//   {
//     id: 17,
//     word: { from: "nouveau", to: "nuevo" },
//     type: { name: "adjecitve", type: "adj" },
//     lang: { from: "fr", to: "es" },
//     example: { from: "Une voiture neuve.", to: "Un coche nuevo." },
//     createdAt: "2025-01-01",
//   },
// ]
