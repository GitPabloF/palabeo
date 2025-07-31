import { useEffect } from "react"
import { RotateCcw, Trophy, Target, BookOpen, Star } from "lucide-react"

import WordCard from "@/components/block/wordCard"
import type { Word } from "@/types/main"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function QuizResult({
  score,
  totalQuestions,
  wrongWordsData,
  onRestart,
}: {
  score: number
  totalQuestions: number
  wrongWordsData: Word[]
  onRestart?: () => void
}) {
  useEffect(() => {
    console.log({ score, totalQuestions, wrongWordsData })
  }, [])

  const percentage = Math.round((score / totalQuestions) * 100)

  const getResultData = () => {
    if (percentage >= 90) {
      return {
        emoji: "🎉",
        title: "Fantastic !",
        subtitle: "You are a true champion !",
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: Trophy,
      }
    } else if (percentage >= 70) {
      return {
        emoji: "👏",
        title: "Well done !",
        subtitle: "You are doing very well !",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        icon: Target,
      }
    } else if (percentage >= 50) {
      return {
        emoji: "💪",
        title: "Not bad at all !",
        subtitle: "You are on the right track !",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        icon: BookOpen,
      }
    } else {
      return {
        emoji: "📚",
        title: "No stress !",
        subtitle: "Each mistake is an opportunity to learn",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        icon: BookOpen,
      }
    }
  }

  const resultData = getResultData()
  const IconComponent = resultData.icon

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="text-center shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50">
        <CardContent className="pt-8 pb-6">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${resultData.bgColor}`}>
              <IconComponent className={`w-8 h-8 ${resultData.color}`} />
            </div>
          </div>

          <div className="text-6xl mb-2">{resultData.emoji}</div>

          <h1 className={`text-3xl font-bold mb-2 ${resultData.color}`}>
            {resultData.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-4">
            {resultData.subtitle}
          </p>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-5xl font-bold text-brand-orange">
              {score}
            </span>
            <span className="text-2xl text-muted-foreground">/</span>
            <span className="text-2xl text-muted-foreground">
              {totalQuestions}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            {percentage}% of success
          </p>

          {onRestart && (
            <Button onClick={onRestart} className="gap-2" size="lg">
              <RotateCcw className="w-4 h-4" />
              Recommencer
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Wrong Words Section */}
      {wrongWordsData.length > 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              📝 Words to review
            </h2>
            <p className="text-sm text-muted-foreground">
              {wrongWordsData.length === 1
                ? "Here is the word you missed :"
                : `Here are the ${wrongWordsData.length} words you missed :`}
            </p>
          </div>

          <Separator />

          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {wrongWordsData.map((word) => (
                <WordCard key={word.id} {...word} showAllTranslation={true} />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
