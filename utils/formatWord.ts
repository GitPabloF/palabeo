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
  // Remove arrows and spaces
  let formattedWord = word.replace(/⇒\s*/g, "").trim()

  // Check if there is a comma (word separation)
  if (formattedWord.includes(",")) {
    const words = formattedWord.split(",").map((w) => w.trim())

    if (words.length === 2) {
      const [first, second] = words

      // Check if it's a masculine/feminine variant
      if (isMasculineFeminineVariant(first, second)) {
        return `${first}/${second.slice(-1)}` // "gato/a"
      } else {
        // If not, they are synonyms, keep the first
        return first
      }
    }
  }

  return formattedWord
}

// Function to detect masculine/feminine variants
function isMasculineFeminineVariant(word1: string, word2: string): boolean {
  // Common rules to detect masculine/feminine variants
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
  return exemple.split("//")[0].trim().replace("ⓘ", "")
}
