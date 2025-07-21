const typeMap: Record<string, string> = {
  adj: "adjective",
  nf: "noun feminine",
  nm: "noun masculine",
  vi: "verb intransitive",
  vt: "verb transitive",
  adv: "adverb",
}

/**
 * Format a part-of-speech type from the WordReference API into a normalized label.
 *
 * @param type - The raw type string (e.g. "adjective", "noun")
 * @returns A normalized type label (e.g. "adjective", "noun", or "unknown")
 */
export function formatType(type?: string): string {
  if (!type) return "unknown"
  return typeMap[type] || type
}
