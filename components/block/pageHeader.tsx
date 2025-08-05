import { LucideIcon } from "lucide-react"
import { getTypeColors } from "@/utils/wordTypeColors"
import { WordTypeCode } from "@/types/main"
import StyledIcon from "@/components/ui/styledIcon"

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
        {Icon && <StyledIcon Icon={Icon} colorType={colorType} />}
        <div>
          <h1 className="text-5xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-xl text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}
