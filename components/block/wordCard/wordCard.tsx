"use client"
import { useEffect, useState } from "react"
import { Word as WordType } from "@/types/main"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import WordCardSide from "./wordCardSide"
import { getTypeColors } from "@/utils/wordTypeColors"

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
  const [isHovered, setIsHovered] = useState(false)

  const colors = getTypeColors(typeCode)

  useEffect(() => {
    if (status === "added" && showAllTranslation !== undefined) {
      setIsFlipped(showAllTranslation)
    }
  }, [showAllTranslation])

  const handleMouseEnter = () => {
    setIsHovered(true)
    setIsFlipped(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsFlipped(false)
  }

  return (
    <div
      ref={parent}
      className={`relative w-full max-w-[320px] aspect-[63/88] perspective-1000 ${
        status === "pending" && "animate-wiggle"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer glow / drop shadow frame */}
      <div
        className={`pointer-events-none absolute -inset-1 rounded-[28px] opacity-60 blur-md transition-opacity duration-500 ${
          isHovered ? colors.glow : "opacity-40"
        }`}
      />

      {/* Trading Card Container */}
      <div
        className={`relative w-full h-full transition-all duration-700 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        } ${isHovered ? "scale-105" : "scale-100"}`}
      >
        {/* Front Side */}
        <div className="front absolute inset-0 w-full h-full backface-hidden ">
          <WordCardSide
            side="front"
            word={wordTo}
            example={exampleTo}
            lang={langTo}
            typeName={typeName}
            colors={colors}
            {...(id !== undefined ? { id } : {})}
            createdAt={createdAt?.toString()}
            status={status}
            onDelete={onDelete}
            isHovered={isHovered}
          />
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <WordCardSide
            side="back"
            word={wordFrom}
            example={exampleFrom}
            lang={langFrom}
            {...(id !== undefined ? { id } : {})}
            createdAt={createdAt?.toString()}
            onDelete={onDelete}
            status={status}
          />
        </div>
      </div>
    </div>
  )
}
