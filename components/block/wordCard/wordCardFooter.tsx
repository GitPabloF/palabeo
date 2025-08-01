import { getDaysAgo } from "@/utils/formatDate"

type CardFooterProps = {
  isFront?: boolean
  id: number
  createdAt?: string
  status?: string
}

export default function WordCardFooter({
  isFront,
  id,
  createdAt,
  status,
}: CardFooterProps) {
  const hint = isFront ? "Hover to reveal translation" : "Release to flip back"
  return (
    <div
      className={`text-center space-y-2 ${
        isFront ? "text-white/80" : "text-gray-500"
      }`}
    >
      <div className="text-xs font-medium">{hint}</div>
      {status === "added" && createdAt && (
        <div className="text-xs">Collected {getDaysAgo(createdAt)}</div>
      )}
      <div className="text-xs font-mono">#{String(id).padStart(4, "0")}</div>
    </div>
  )
}
