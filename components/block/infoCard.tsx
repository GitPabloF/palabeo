import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"
import { getTypeColors } from "@/utils/wordTypeColors"

interface QuizIntroProps {
  onStartQuiz: () => void
  title?: string
  description?: string
  badges?: Array<{
    icon: React.ReactNode
    text: string
  }>
  colorType?: string
  children?: React.ReactNode
  isShiny?: boolean
  button?: {
    text: string
    icon: React.ReactNode
  }
}

export default function QuizIntro({
  title,
  badges,
  description,
  children,
  onStartQuiz,
  colorType = "v",
  isShiny = true,
  button,
}: QuizIntroProps) {
  const colors = getTypeColors(colorType)

  return (
    <div
      className={`overflow-hidden relative z-10 rounded-3xl shadow-2xl border-4 ${colors.border} group transition-all duration-300 hover:${colors.glow}`}
    >
      <div className={`absolute inset-0 ${colors.bg} opacity-95`} />
      {/* Background gradient & shiny effect */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10" /> */}
      {isShiny && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-transform duration-1000 group-hover:translate-x-full -translate-x-full " />
      )}

      <div className="relative z-10 p-8 flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
          <p className="text-xl text-white/90">{description}</p>
        </div>

        {/* Stats badges with word card colors */}
        <div className="flex flex-wrap gap-4 justify-center">
          {badges &&
            badges.map((badge) => (
              <Badge
                key={badge.text}
                className="px-6 py-3 text-base bg-white/20 backdrop-blur-sm text-white border-white/30"
              >
                {badge.icon}
                {badge.text}
              </Badge>
            ))}
        </div>

        {/* Game rules with word card styling */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          {children}
        </div>

        {button && (
          <div className="text-center">
            <Button
              onClick={onStartQuiz}
              size="lg"
              className={`text-xl bg-white text-gray-800 hover:bg-gray-50 rounded-2xl font-bold transform hover:scale-105 transition-all duration-200 shadow-2xl border-4 ${colors.border} overflow-hidden w-auto py-8 px-16 cursor-pointer`}
            >
              {button.icon}
              {button.text}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
