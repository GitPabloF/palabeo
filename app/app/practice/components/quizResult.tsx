import { useEffect } from "react"
import { RotateCcw, Trophy, Target, BookOpen } from "lucide-react"

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
        title: "Excellent !",
        subtitle: "Tu as vraiment bien réussi !",
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: Trophy,
        message: "Continue comme ça, tu progresses vraiment bien !",
      }
    } else if (percentage >= 70) {
      return {
        emoji: "👏",
        title: "Bien joué !",
        subtitle: "Tu t'en sors plutôt bien !",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        icon: Target,
        message: "Quelques erreurs, mais dans l'ensemble c'est solide !",
      }
    } else if (percentage >= 50) {
      return {
        emoji: "💪",
        title: "Pas mal !",
        subtitle: "Tu peux faire mieux !",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        icon: BookOpen,
        message: "Continue à pratiquer, tu vas y arriver !",
      }
    } else {
      return {
        emoji: "📚",
        title: "Pas de panique !",
        subtitle: "C'est normal de faire des erreurs",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        icon: BookOpen,
        message: "Chaque erreur est une occasion d'apprendre !",
      }
    }
  }

  const resultData = getResultData()
  const IconComponent = resultData.icon

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="text-center">
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
            {percentage}% de réussite
          </p>

          <p className="text-base text-foreground mb-6 max-w-md mx-auto">
            {resultData.message}
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
              📝 Les mots à revoir
            </h2>
            <p className="text-sm text-muted-foreground">
              {wrongWordsData.length === 1
                ? "Voici le mot que tu as manqué :"
                : `Voici les ${wrongWordsData.length} mots que tu as manqués :`}
            </p>
          </div>

          <Separator />

          <ScrollArea className="h-[400px] rounded-xl border p-4">
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
