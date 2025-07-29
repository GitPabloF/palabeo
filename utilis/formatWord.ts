import { WORD_TYPE } from "@/content/main"

/**
 * Format a part-of-speech type from the WordReference API into a normalized label.
 *
 * @param type - The raw type string (e.g. "adjective", "noun")
 * @returns A normalized type label (e.g. "adjective", "noun", or "unknown")
 */
export function formatTypeName(type?: string): string {
  if (!type) return "unknown"
  // for (const [code, label] of Object.entries(WORD_TYPE)) {
  //   if (type.startsWith(code) || code.startsWith(type)) {
  //     return label
  //   }
  // }

  // // If no match found, return the original type
  // return type
  return WORD_TYPE[type] || type
}
