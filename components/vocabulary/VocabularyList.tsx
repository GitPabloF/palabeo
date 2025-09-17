import { Word } from "@/types/main"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import WordCard from "@/components/block/wordCard/wordCard"
import CardSkeleton from "@/components/ui/cardSkeleton"

interface VocabularyListProps {
  words?: Word[]
  loading?: boolean
  onDelete?: (id: number) => void
  showAllTranslation?: boolean
}

export function VocabularyList({
  words,
  onDelete,
  loading,
  showAllTranslation,
}: VocabularyListProps) {
  const [parent] = useAutoAnimate()

  if (!words || loading) {
    return (
      <div className="lex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  if (words && words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
        <p className="text-lg font-medium">
          Looks like you haven't added any words. Let's fix that!
        </p>
      </div>
    )
  }

  return (
    <div
      className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      ref={parent}
    >
      {words.map((word) => (
        <WordCard
          key={word.id}
          {...word}
          onDelete={onDelete}
          showAllTranslation={showAllTranslation}
        />
      ))}
    </div>
  )
}
