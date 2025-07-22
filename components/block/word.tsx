"use client"
import { useState } from "react"
import { Eye, EyeClosed, Trash, FilePenLine } from "lucide-react"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Word as WordType } from "@/types/word"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import { getDaysAgo } from "@/utilis/formatDate"
import { formatType } from "@/utilis/formatWord"

// TODO: add onEdit
type WordProps = WordType & {
  onDelete: (id: number) => void
}

export default function Word({
  id,
  word,
  translatedWord,
  createdAt,
  lang,
  onDelete,
}: WordProps) {
  const [showTranslation, setShowTranslation] = useState(true)
  const [parent] = useAutoAnimate()

  return (
    <Card className="gap-1 relative group" ref={parent}>
      <CardHeader className="absolut gap-0">
        {/* action buttons */}
        <CardAction className="text-gray-400 absolute transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100 ">
          <button
            className="px-1 py-1 hover:text-gray-700 cursor-pointer"
            onClick={() => onDelete(id)}
          >
            <Trash size={20} />
          </button>
        </CardAction>
      </CardHeader>

      {/* word */}
      <CardContent className="">
        <span className="py-1 px-1.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-2xl mb-1 inline-block">
          Adjective
        </span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold capitalize">{word}</span>
          <img
            src="http://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg"
            alt="ES"
            className="w-5 h-5"
          />
        </div>
        <p className="italic mt-0.5">
          "Debes cocinar sin grasa para cuidar tu nivel de colesterol"
        </p>
      </CardContent>

      {/* translation */}
      <CardContent className="flex gap-2 mt-4 flex-col">
        <Separator />
        <div ref={parent}>
          {showTranslation && (
            <div className="flex flex-col pb-1.5">
              <span className="text-lg font-bold capitalize text-slate-400">
                {translatedWord}
              </span>
              <p className="italic mt-0.5 text-slate-600">
                "Tu dois cuisiner sans gras pour faire attention à ton niveau de
                cholestérol"
              </p>
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
