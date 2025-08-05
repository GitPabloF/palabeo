"use client"
import QuizCard from "../../../components/block/quiz/quizCard"
import QuizResult from "../../../components/block/quiz/quizResult"
import InfoCard from "../../../components/block/infoCard"
import { useQuizGame } from "@/hooks/useQuizGame"
import { useUser } from "@/contexts/UserContext"
import { useWords } from "@/hooks/useWords"
import { Clock, Sword, Target, Zap } from "lucide-react"
import PageHeader from "@/components/block/pageHeader"
import { sampleQuestions } from "@/content/main"

export default function PracticePage() {
  const { currentUser } = useUser()
  const { words } = useWords(currentUser?.id)

  const {
    currentQuestion,
    score,
    totalQuestions,
    isGameComplete,
    isQuizStarted,
    questionIndex,
    handleNextQuestion,
    startQuiz,
    wrongWordsData,
  } = useQuizGame(sampleQuestions, words)

  const content = {
    title: "Vocabulary Quest",
    description:
      "Test your vocabulary mastery with 6 carefully crafted questions",
    icon: Sword,
    colorType: "v",
    badges: [
      {
        icon: <Target className="w-5 h-5 mr-2" />,
        text: "6 Questions",
      },
      {
        icon: <Clock className="w-5 h-5 mr-2" />,
        text: "Timed Challenge",
      },
    ],
    button: {
      text: "Start Your Quest",
      icon: <Zap className="w-6 h-6 mr-3 text-yellow-500" />,
    },
  }

  return (
    <div className="max-w-[900px] mx-auto pb-8 px-4">
      <PageHeader
        title="Vocabulary Quest"
        description="Master Your Words"
        icon={Sword}
        colorType="v"
      />

      {/* Quiz Intro */}
      {!isQuizStarted && (
        <InfoCard {...content} onStartQuiz={startQuiz}>
          <h3 className="font-semibold text-xl mb-4 text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-300" />
            How to Play
          </h3>
          <div className="grid gap-4 text-white/90">
            <div className="flex items-start gap-4">
              <span className="text-lg">
                Choose the correct translation before time runs out
              </span>
            </div>
          </div>
        </InfoCard>
      )}

      {/* Quiz Game */}
      {isQuizStarted && !isGameComplete && (
        <QuizCard
          key={questionIndex}
          {...currentQuestion}
          totalQuestions={totalQuestions}
          nextQuestion={handleNextQuestion}
        />
      )}

      {/* Quiz Result */}
      {isGameComplete && (
        <QuizResult
          score={score}
          totalQuestions={totalQuestions}
          wrongWordsData={wrongWordsData}
        />
      )}
    </div>
  )
}
