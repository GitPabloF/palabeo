import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ShowButton from "@/components/ui/showButton"

interface VocabularyFiltersProps {
  showAllTranslation: boolean
  onShowTranslationChange: (
    value: boolean | ((prev: boolean) => boolean)
  ) => void
}

export function VocabularyFilters({
  showAllTranslation,
  onShowTranslationChange,
}: VocabularyFiltersProps) {
  const filterButtonClass =
    "bg-gray-100 text-black px-3 py-2 hover:bg-brand-orange/10 hover:text-brand-orange text-base"

  return (
    <div className="px-10">
      <Card>
        <CardContent className="flex justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold">Filter by:</span>
            <div className="flex gap-1.5">
              <Button className={filterButtonClass}>All Words</Button>
              <Button className={filterButtonClass}>Recently Added</Button>
            </div>
          </div>
          <ShowButton
            type="multiple"
            showTranslation={showAllTranslation}
            setShowTranslation={onShowTranslationChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}
