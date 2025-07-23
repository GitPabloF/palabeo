import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function CardSkeleton() {
  return (
    <Card className="h-[190] px-10 py-5">
      <div className="space-y-2 mt-4">
        <Skeleton className="h-4 max-w-[300px]" />
        <Skeleton className="h-4 max-w-full" />
      </div>
      <div className="space-y-2 mt-4">
        <Skeleton className="h-4 max-w-[300px]" />
        <Skeleton className="h-4 max-w-full" />
      </div>
    </Card>
  )
}
