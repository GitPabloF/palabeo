"use client"
import { useEffect, useState } from "react"
import { Trash, FilePenLine } from "lucide-react"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Word as WordType, LangCode, WordTypeCode } from "@/types/main"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import { getDaysAgo } from "@/utilis/formatDate"
import AppAlertDialog from "@/app/app/components/appAlertDialog"
import { getFlagURL } from "@/utils/getFlag"

// TODO: add onEdit
type WordCardProps = WordType & {
  onDelete?: (id: number) => void
  showAllTranslation?: boolean
  status?: "loading" | "pending" | "added"
}

export default function WordCard({
  id,
  wordFrom,
  wordTo,
  typeCode,
  typeName,
  langFrom,
  langTo,
  exampleFrom,
  exampleTo,
  createdAt,
  onDelete,
  status = "added",
  showAllTranslation,
}: WordCardProps) {
  const [parent] = useAutoAnimate()
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    if (status === "added" && showAllTranslation !== undefined) {
      setIsFlipped(showAllTranslation)
    }
  }, [showAllTranslation])

  const typeColor: Record<
    WordTypeCode,
    { bg: string; text: string; border: string }
  > = {
    verb: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      text: "text-white",
      border: "border-blue-400",
    },
    nf: {
      bg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      text: "text-white",
      border: "border-yellow-400",
    },
    nm: {
      bg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      text: "text-white",
      border: "border-yellow-400",
    },
    adj: {
      bg: "bg-gradient-to-br from-purple-500 to-purple-600",
      text: "text-white",
      border: "border-purple-400",
    },
    vi: {
      bg: "bg-gradient-to-br from-green-500 to-green-600",
      text: "text-white",
      border: "border-green-400",
    },
    vt: {
      bg: "bg-gradient-to-br from-green-500 to-green-600",
      text: "text-white",
      border: "border-green-400",
    },
    adv: {
      bg: "bg-gradient-to-br from-violet-500 to-violet-600",
      text: "text-white",
      border: "border-violet-400",
    },
    pron: {
      bg: "bg-gradient-to-br from-pink-500 to-pink-600",
      text: "text-white",
      border: "border-pink-400",
    },
  }

  function getTypeColors(type: keyof typeof typeColor) {
    return (
      typeColor[type] ?? {
        bg: "bg-gradient-to-br from-gray-500 to-gray-600",
        text: "text-white",
        border: "border-gray-400",
      }
    )
  }

  const colors = getTypeColors(typeCode)

  return (
    <div
      ref={parent}
      className={`relative w-full h-90 perspective-1000 ${
        status === "pending" && "opacity-70"
      }`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* Trading Card Container */}
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side (Word) */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div
            className={`relative w-full h-full rounded-2xl shadow-xl border-2 ${colors.border} overflow-hidden group`}
          >
            {/* Background Pattern */}
            <div className={`absolute inset-0 ${colors.bg} opacity-90`} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

            {/* Corner Decoration */}
            <div className="absolute top-0 left-0 w-8 h-8 bg-white/20 rounded-br-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-white/20 rounded-tl-xl" />

            {/* Action Button */}
            {status === "added" && (
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <AppAlertDialog
                  title="Delete this word?"
                  description="This word will be permanently removed from your list. This action cannot be undone."
                  onConfirm={() => onDelete?.(id)}
                >
                  <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                    <Trash size={16} className="text-white" />
                  </button>
                </AppAlertDialog>
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              {/* Header */}
              <div className="text-center">
                <span
                  className={`inline-block px-3 py-1 ${colors.text} text-xs font-bold rounded-full uppercase tracking-wider shadow-lg`}
                >
                  {typeName}
                </span>
              </div>

              {/* Main Word */}
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img
                    src={getFlagURL(langTo)}
                    alt={langTo}
                    className="w-8 h-8 drop-shadow-lg"
                  />
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg capitalize">
                    {wordTo}
                  </h2>
                </div>
                {exampleTo && (
                  <p className="text-white/90 italic text-sm leading-relaxed">
                    "{exampleTo}"
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="text-center">
                <div className="text-white/70 text-xs">
                  Hover to see translation
                </div>
                {status === "added" && (
                  <div className="text-white/60 text-xs mt-1">
                    Added {getDaysAgo(createdAt.toString())}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back Side (Translation) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="relative w-full h-full rounded-2xl shadow-xl border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.8),transparent)]" />

            {/* Corner Decoration */}
            <div className="absolute top-0 left-0 w-8 h-8 bg-gray-300 rounded-br-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-300 rounded-tl-xl" />

            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              {/* Header */}
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-gray-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  Translation
                </span>
              </div>

              {/* Main Translation */}
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img
                    src={getFlagURL(langFrom)}
                    alt={langFrom}
                    className="w-8 h-8 drop-shadow-lg"
                  />
                  <h2 className="text-3xl font-bold text-gray-800 drop-shadow-sm capitalize">
                    {wordFrom}
                  </h2>
                </div>
                {exampleFrom && (
                  <p className="text-gray-600 italic text-sm leading-relaxed">
                    "{exampleFrom}"
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="text-center">
                <div className="text-gray-500 text-xs">
                  Release to flip back
                </div>
                {status === "added" && (
                  <div className="text-gray-400 text-xs mt-1">
                    Added {getDaysAgo(createdAt.toString())}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
