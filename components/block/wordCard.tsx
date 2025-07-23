"use client"
import { useEffect, useState } from "react"
import { Trash, FilePenLine } from "lucide-react"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Word as WordType, LangCode } from "@/types/main"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import { getDaysAgo } from "@/utilis/formatDate"
import AppAlertDialog from "@/app/app/components/appAlertDialog"
import ShowButton from "../ui/showButton"

// TODO: add onEdit
type WordCardProps = WordType & {
  onDelete: (id: number) => void
  showAllTranslation: boolean
  status?: "loading" | "pending" | "added"
}

export default function WordCard({
  id,
  word,
  createdAt,
  type,
  example,
  lang,
  onDelete,
  status = "added",
  showAllTranslation,
}: WordCardProps) {
  const [parent] = useAutoAnimate()

  const [showTranslation, setShowTranslation] = useState(true)

  const displayTranslation = showTranslation || status === "pending"

  const flagURL = (lang: LangCode) =>
    `http://purecatamphetamine.github.io/country-flag-icons/3x2/${lang.toUpperCase()}.svg`

  useEffect(() => {
    setShowTranslation(showAllTranslation)
  }, [showAllTranslation])

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
    <Card
      ref={parent}
      className={`gap-1 relative group rounded-xl shadow-md p-4 transition-all opacity-80 border-brand-orange border-dashed
        ${status === "pending" && "animate-wiggle"}`}
    >
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
          <img src={flagURL(lang.to)} alt={lang.to} className="w-5 h-5" />
        </div>
        {example?.from && <p className="italic mt-0.5">"{example.to}"</p>}
      </CardContent>

      {/* translation */}
      <CardContent className="flex gap-2 mt-4 flex-col">
        <Separator />
        <div ref={parent}>
          {displayTranslation && (
            <div className="flex flex-col pb-1.5">
              <span className="text-lg font-bold capitalize text-slate-400">
                {word.from}
              </span>
              {example?.to && (
                <p className="italic mt-0.5 text-slate-600">"{example.from}"</p>
              )}
            </div>
          )}
        </div>
        {status === "added" && (
          <div className="flex justify-between items-center gap-0.5">
            <ShowButton {...{ showTranslation, setShowTranslation }} />
            <span className="text-sm text-gray-400 inline-block">
              Added {getDaysAgo(createdAt)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
