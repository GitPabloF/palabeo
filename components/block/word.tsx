"use client"
import { useState } from "react"
import { Eye, EyeClosed, Trash, FilePenLine } from "lucide-react"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Word as WordType } from "@/types/word"

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

  /**
   * @description Get the number of days ago from the createdAt date
   * @param createdAt - The createdAt date
   * @returns The number of days ago
   */
  function getDaysAgo(createdAt: string) {
    const createdAtDate = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createdAtDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    // handle months and days
    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30)
      if (months === 1) {
        return "1 month ago"
      }
      return `${months} months ago`
    }
    if (diffDays === 1) {
      return "1 day ago"
    }
    return `${diffDays} days ago`
  }

  return (
    <Card className="gap-1 relative">
      <CardHeader className="absolut">
        {/* action buttons */}
        <CardAction className="text-gray-400 absolute">
          <button
            className="px-1 py-1 hover:text-gray-700 cursor-pointer"
            onClick={() => onDelete(id)}
          >
            <Trash size={20} />
          </button>
          <button
            className="px-1 py-1 hover:text-gray-700 cursor-pointer"
            onClick={() => {}}
          >
            <FilePenLine size={20} />
          </button>
        </CardAction>
      </CardHeader>

      {/* word */}
      <CardContent className="">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{word}</span>
          <img
            src="http://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg"
            alt="ES"
            className="w-5 h-5"
          />
        </div>
      </CardContent>

      {/* translation */}
      <CardContent className="flex flex-col gap-2 mt-4">
        <Separator />

        <div className="flex justify-between items-center">
          <span
            className={`transition-opacity duration-200 ease-in-out font-bold  text-slate-400 ${
              showTranslation ? "opacity-100" : "opacity-0"
            }`}
          >
            {translatedWord}
          </span>
          {/* show translation button */}
          <Button
            variant="ghost"
            className="text-blue-400 text-sm font-bold gap-1 hover:text-blue-400"
            onClick={() => setShowTranslation((v) => !v)}
          >
            <div className="relative w-6 h-6 translate-y-1/6 translate-x-1/6">
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
          </Button>
        </div>
      </CardContent>
      <div className="text-sm text-gray-400 self-end px-6">
        <span className="text-sm text-gray-400 px-4">
          Added {getDaysAgo(createdAt)}
        </span>
      </div>
    </Card>
  )
}
