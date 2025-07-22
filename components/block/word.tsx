"use client"
import { useState } from "react"
import { Eye, EyeClosed, Trash, FilePenLine } from "lucide-react"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Word as WordType } from "@/types/main"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import { getDaysAgo } from "@/utilis/formatDate"
import AppAlertDialog from "@/app/app/components/appAlertDialog"

// TODO: add onEdit
type WordProps = WordType & {
  onDelete: (id: number) => void
}

export default function Word({
  id,
  word,
  createdAt,
  type,
  example,
  lang,
  onDelete,
}: WordProps) {
  const [showTranslation, setShowTranslation] = useState(true)
  const [parent] = useAutoAnimate()

  const typeColor: Record<
    "verb" | "nf" | "nm" | "adj" | "vi" | "vt" | "adv",
    { bg: string; text: string }
  > = {
    verb: {
      bg: "text-blue-600",
      text: "bg-blue-100",
    },
    nf: {
      bg: "text-yellow-600",
      text: "bg-yellow-100",
    },
    nm: {
      bg: "text-yellow-600",
      text: "bg-yellow-100",
    },
    adj: {
      bg: "text-purple-600",
      text: "bg-purple-100",
    },
    vi: {
      bg: "text-green-600",
      text: "bg-green-100",
    },
    vt: {
      bg: "text-green-600",
      text: "bg-green-100",
    },
    adv: {
      bg: "text-violet-600",
      text: "bg-violet-100",
    },
  }

  function getTypeColors(type: keyof typeof typeColor) {
    return typeColor[type] ?? { bg: "text-gray-600", text: "bg-gray-100" }
  }

  return (
    <Card className="gap-1 relative group" ref={parent}>
      <CardHeader className="absolut gap-0">
        {/* action buttons */}
        <CardAction className="text-gray-400 absolute transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100 ">
          <AppAlertDialog
            title="Delete this word?"
            description="This word will be permanently removed from your list. This action cannot be undone."
            onConfirm={() => onDelete(id)}
          >
            <button className="px-1 py-1 hover:text-gray-700 cursor-pointer">
              <Trash size={20} />
            </button>
          </AppAlertDialog>
        </CardAction>
      </CardHeader>
      {/* word */}
      <CardContent>
        <span
          className={`py-1 px-1.5 ${getTypeColors(type.type).bg} ${
            getTypeColors(type.type).text
          } text-xs font-bold rounded-2xl mb-1 inline-block capitalize`}
        >
          {type.name}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold capitalize">{word.to}</span>
          <img
            src="http://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg"
            alt="ES"
            className="w-5 h-5"
          />
        </div>
        {example?.from && <p className="italic mt-0.5">"{example.from}"</p>}
      </CardContent>

      {/* translation */}
      <CardContent className="flex gap-2 mt-4 flex-col">
        <Separator />
        <div ref={parent}>
          {showTranslation && (
            <div className="flex flex-col pb-1.5">
              <span className="text-lg font-bold capitalize text-slate-400">
                {word.from}
              </span>
              {example?.to && (
                <p className="italic mt-0.5 text-slate-600">"{example.to}"</p>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center gap-0.5">
          <button
            className="text-blue-400 text-sm font-bold gap-2 hover:text-blue-600 flex items-center cursor-pointer"
            onClick={() => setShowTranslation((v) => !v)}
          >
            <div className="relative w-6 h-6  translate-x-1/6">
              <Eye
                className={`
                  absolute top-0 left-0 w-full h-full
                  transition-opacity duration-200 ease-in-out
                  ${
                    !showTranslation
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }
                `}
              />
              <EyeClosed
                className={`
                  absolute top-0 left-0 w-full h-full
                  transition-opacity duration-200 ease-in-out
                  ${
                    showTranslation
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }
                `}
              />
            </div>
            <div>
              <span>
                {showTranslation ? " Hide Translation" : "Show Translation"}
              </span>
            </div>
          </button>
          <span className="text-sm text-gray-400 inline-block">
            Added {getDaysAgo(createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
