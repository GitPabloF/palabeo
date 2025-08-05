/**
 * Normalize text to remove accents and convert to lowercase
 * @param text - The text to normalize
 * @returns The normalized text
 */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

/**
 * Generate search variations for a word (accents + o/a variations)
 * @param word - The word to generate variations for
 * @returns Array of search variations
 */
export function generateSearchVariations(word: string): string[] {
  const normalizedWord = normalizeText(word)
  const variations = [word, normalizedWord]

  // If the word ends with 'o', add the variation 'a'
  if (word.endsWith("o")) {
    const baseWord = word.slice(0, -1)
    variations.push(baseWord + "a", normalizeText(baseWord + "a"))
  }

  // If the word ends with 'a', add the variation 'o'
  if (word.endsWith("a")) {
    const baseWord = word.slice(0, -1)
    variations.push(baseWord + "o", normalizeText(baseWord + "o"))
  }

  return [...new Set(variations)] // Remove duplicates
}
