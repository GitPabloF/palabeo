import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function CardSkeleton() {
  return (
    <Card className="h-100 px-10 py-8 flex flex-col gap-4 justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 max-w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 max-w-full" />
        <Skeleton className="h-4 max-w-full" />
        <Skeleton className="h-4 max-w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 max-w-full" />
        <Skeleton className="h-4 max-w-full" />
      </div>
    </Card>
  )
}
