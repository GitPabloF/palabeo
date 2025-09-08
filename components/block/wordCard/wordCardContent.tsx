import { getFlagURL } from "@/utils/getFlag"
import { LangCode } from "@/types/main"

type CardContentProps = {
  word: string
  example?: string
  lang: LangCode
  isFront?: boolean
}

export default function WordCardContent({
  word,
  example,
  lang,
  isFront = true,
}: CardContentProps) {
  return (
    <div className="text-center flex-1 flex flex-col justify-center space-y-4">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="relative flex-shrink-0">
          <img
            src={getFlagURL(lang, "rounded")}
            alt={lang}
            className={`w-10 h-10 drop-shadow-lg rounded-full border-2 ${
              isFront ? "border-white/40" : "border-gray-300"
            }`}
          />
        </div>
        <span
          className={`text-[32px] leading-tight font-extrabold tracking-wide drop-shadow-lg ${
            isFront ? "text-white" : "text-gray-800 drop-shadow-sm"
          }`}
        >
          {word}
        </span>
      </div>

      {example && (
        <div className="relative px-4">
          <div
            className={`absolute inset-0 rounded-lg blur-sm ${
              isFront ? "bg-white/10" : "bg-gray-200/50"
            }`}
          />
          <p
            className={`relative text-[12px] font-semibold p-2 rounded-lg backdrop-blur-sm border ${
              isFront
                ? "text-white/90 bg-black/20 border-white/20"
                : "text-gray-900 bg-white/90 border-gray-300"
            }`}
          >
            “{example}”
          </p>
        </div>
      )}
    </div>
  )
}
