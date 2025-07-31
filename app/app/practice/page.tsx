"use client"
import QuizCard from "./components/quizCard"
import QuizResult from "./components/quizResult"
import { useQuizGame } from "@/hooks/useQuizGame"
import type { Question } from "@/types/main"

const sampleQuestions: Question[] = [
  {
    questionNumber: 1,
    word: "Falda",
    answer: "Skirt",
    options: ["Skirt", "Pants", "Shorts", "Dress"],
  },
  {
    questionNumber: 2,
    word: "Zapato",
    answer: "Shoe",
    options: ["Shoe", "Boot", "Sandals", "Slipper"],
  },
  {
    questionNumber: 3,
    word: "sombrero",
    answer: "Hat",
    options: ["Hat", "Cap", "Glove", "Scarf"],
  },
  {
    questionNumber: 4,
    word: "casa",
    answer: "House",
    options: ["House", "Car", "Bike", "Train"],
  },
  {
    questionNumber: 5,
    word: "coche",
    answer: "Car",
    options: ["Car", "Bike", "Train", "Plane"],
  },
  {
    questionNumber: 6,
    word: "casa",
    answer: "House",
    options: ["House", "Car", "Bike", "Train"],
  },
]

export default function PracticePage() {
  const {
    currentQuestion,
    score,
    totalQuestions,
    isGameComplete,
    questionIndex,
    handleNextQuestion,
  } = useQuizGame(sampleQuestions)

  if (isGameComplete) {
    return <QuizResult score={score} totalQuestions={totalQuestions} />
  }

  return (
    <>
      <QuizCard
        key={questionIndex}
        {...currentQuestion}
        totalQuestions={totalQuestions}
        nextQuestion={handleNextQuestion}
      />
    </>
  )
}
