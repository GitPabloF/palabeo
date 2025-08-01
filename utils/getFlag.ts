import { LangCode } from "@/types/main"

export const getFlagURL = (
  lang: LangCode,
  type: "rounded" | "default" = "default"
) => {
  if (!lang) return ""
  let langCode
  langCode = lang.toUpperCase()
  if (langCode === "EN") langCode = "US"
  if (type === "rounded") {
    langCode = langCode.toLowerCase()
    return `https://hatscripts.github.io/circle-flags/flags/${langCode}.svg`
  }
  return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${langCode}.svg`
}
