import { Word } from "@/lib/generated/prisma"
import { transformWordForCard } from "@/utils/wordTransformers"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import WordCard from "@/components/block/wordCard"
import CardSkeleton from "@/components/ui/cardSkeleton"

interface VocabularyListProps {
  words: Word[]
  loading: boolean
  onDelete: (id: number) => void
  showAllTranslation: boolean
}

export function VocabularyList({
  words,
  loading,
  onDelete,
  showAllTranslation,
}: VocabularyListProps) {
  const [parent] = useAutoAnimate()

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-5">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
        <p className="text-lg font-medium">
          Looks like you haven't added any words. Let's fix that!
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col gap-5" ref={parent}>
      {words.map((word) => (
        <WordCard
          key={word.id}
          {...transformWordForCard(word)}
          onDelete={onDelete}
          showAllTranslation={showAllTranslation}
        />
      ))}
    </div>
  )
}
