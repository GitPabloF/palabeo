import { getTypeColors } from "@/utils/wordTypeColors"
import { LucideIcon } from "lucide-react"

interface StyledIconProps {
  Icon: LucideIcon
  colorType: string
  size?: number
}

export default function StyledIcon({
  Icon,
  colorType,
  size = 20,
}: StyledIconProps) {
  const colors = getTypeColors(colorType)
  return (
    <div className="relative">
      <div
        className={`w-20 h-20 ${colors.bg} rounded-3xl flex items-center justify-center shadow-2xl border-4 ${colors.border} transition-all duration-300`}
      >
        <Icon className={`w-10 h-10 text-white`} />
      </div>
    </div>
  )
}
