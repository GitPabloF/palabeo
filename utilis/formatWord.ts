import { WORD_TYPE } from "@/content/main"

/**
 * Format a part-of-speech type from the WordReference API into a normalized label.
 *
 * @param type - The raw type string (e.g. "adjective", "noun")
 * @returns A normalized type label (e.g. "adjective", "noun", or "unknown")
 */
export function formatTypeName(type?: string): string {
  if (!type) return "unknown"
  return (
    Object.values(WORD_TYPE).find((wordType) => {
      return wordType.associated.includes(type.toLowerCase())
    })?.name || type
  )
}

export function formatTypeCode(type?: string): string {
  if (!type) return "unknown"
  return (
    Object.keys(WORD_TYPE).find((key) => {
      return WORD_TYPE[key].associated.includes(type.toLowerCase())
    }) || type
  )
}

export function formatWord(word: string): string {
  // D'abord nettoyer les flèches et espaces
  let formattedWord = word.replace(/⇒\s*/g, "").trim()

  // Vérifier s'il y a une virgule (séparation de mots)
  if (formattedWord.includes(",")) {
    const words = formattedWord.split(",").map((w) => w.trim())

    if (words.length === 2) {
      const [first, second] = words

      // Vérifier si c'est une variante masculin/féminin
      if (isMasculineFeminineVariant(first, second)) {
        return `${first}/${second.slice(-1)}` // "gato/a"
      } else {
        // Sinon, ce sont des synonymes, garder le premier
        return first
      }
    }
  }

  return formattedWord
}

// Fonction pour détecter les variantes masculin/féminin
function isMasculineFeminineVariant(word1: string, word2: string): boolean {
  // Règles communes pour détecter les variantes m/f
  const patterns = [
    // o/a (gato/gata)
    { pattern: /^(.+)o$/, suffix: "a" },
    // e/a (estudiante/estudianta)
    { pattern: /^(.+)e$/, suffix: "a" },
    // ón/ona (campeón/campeona)
    { pattern: /^(.+)ón$/, suffix: "ona" },
    // án/ana (artesán/artesana)
    { pattern: /^(.+)án$/, suffix: "ana" },
    // ín/ina (pequeñín/pequeñina)
    { pattern: /^(.+)ín$/, suffix: "ina" },
    // or/ora (trabajador/trabajadora)
    { pattern: /^(.+)or$/, suffix: "ora" },
    // és/esa (francés/francesa)
    { pattern: /^(.+)és$/, suffix: "esa" },
    // is/isa (feliz/felisa)
    { pattern: /^(.+)is$/, suffix: "isa" },
  ]

  for (const { pattern, suffix } of patterns) {
    const match = word1.match(pattern)
    if (match) {
      const base = match[1]
      const expectedFeminine = base + suffix
      if (word2 === expectedFeminine) {
        return true
      }
    }
  }

  return false
}

export function formatExemple(exemple: string): string {
  return exemple.split("//")[0].trim()
}
