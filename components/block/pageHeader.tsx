import { LucideIcon } from "lucide-react"
import { getTypeColors } from "@/utils/wordTypeColors"
import { WordTypeCode } from "@/types/main"

interface PageHeaderProps {
  title: string
  description: string
  icon?: LucideIcon
  colorType?: WordTypeCode
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  colorType = "vi",
}: PageHeaderProps) {
  const colors = getTypeColors(colorType)

  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-4 mb-6">
        {Icon && (
          <div className="relative">
            <div
              className={`w-20 h-20 ${colors.bg} rounded-3xl flex items-center justify-center shadow-2xl border-4 ${colors.border} transition-all duration-300 hover:scale-110`}
            >
              <Icon className="w-10 h-10 text-white" />
            </div>
          </div>
        )}
        <div>
          <h1 className="text-5xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-xl text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}
