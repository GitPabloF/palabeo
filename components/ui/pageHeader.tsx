import { LucideIcon } from "lucide-react"

interface PageHeaderProps {
  title: string
  description: string
  leftIcon?: LucideIcon
  leftIconColor?: string
  leftIconBgColor?: string
}

export default function PageHeader({
  title,
  description,
  leftIcon: LeftIcon,
  leftIconColor = "text-brand-orange",
  leftIconBgColor = "from-brand-orange/10 to-brand-orange/20",
}: PageHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        {LeftIcon && (
          <div
            className={`p-3 bg-gradient-to-br ${leftIconBgColor} rounded-full`}
          >
            <LeftIcon className={`w-6 h-6 ${leftIconColor}`} />
          </div>
        )}

        <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-orange to-orange-600 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>

      <p className="text-lg text-slate-700 max-w-md mx-auto">{description}</p>
    </div>
  )
}
