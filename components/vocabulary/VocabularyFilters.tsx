import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ShowButton from "@/components/ui/showButton"
import { cn } from "@/lib/utils"

export type SortOption = "alphabetical" | "recentlyAdded"

interface VocabularyFiltersProps {
  showAllTranslation: boolean
  onShowTranslationChange: (
    value: boolean | ((prev: boolean) => boolean)
  ) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

export function VocabularyFilters({
  showAllTranslation,
  onShowTranslationChange,
  sortBy,
  onSortChange,
}: VocabularyFiltersProps) {
  const filterButtonClass =
    "bg-gray-100 text-black px-3 py-2 hover:bg-brand-orange/10 hover:text-brand-orange text-base"

  const activeButtonClass =
    "bg-brand-orange text-white px-3 py-2 hover:bg-brand-orange/90 text-base"

  return (
    <Card>
      <CardContent className="flex gap-4 justify-between">
        {/* Sort Options */}
        <div className="flex items-center gap-4">
          <span className="font-bold">Sort by:</span>
          <div className="flex gap-1.5">
            <Button
              className={cn(
                sortBy === "alphabetical"
                  ? activeButtonClass
                  : filterButtonClass
              )}
              onClick={() => onSortChange("alphabetical")}
            >
              Alphabetical
            </Button>
            <Button
              className={
                sortBy === "recentlyAdded"
                  ? activeButtonClass
                  : filterButtonClass
              }
              onClick={() => onSortChange("recentlyAdded")}
            >
              Recently Added
            </Button>
          </div>
        </div>

        {/* Translation Toggle */}
        <div className="flex justify-end">
          <ShowButton
            type="multiple"
            showTranslation={showAllTranslation}
            setShowTranslation={onShowTranslationChange}
          />
        </div>
      </CardContent>
    </Card>
  )
}
