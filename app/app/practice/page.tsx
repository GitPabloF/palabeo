"use client"
import QuizCard from "../../../components/block/quiz/quizCard"
import QuizResult from "../../../components/block/quiz/quizResult"
import QuizIntro from "../../../components/block/quiz/quizIntro"
import { useQuizGame } from "@/hooks/useQuizGame"
import { useUser } from "@/contexts/UserContext"
import { useWords } from "@/hooks/useWords"
import { Sword } from "lucide-react"
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
        <QuizIntro totalQuestions={totalQuestions} onStartQuiz={startQuiz} />
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
