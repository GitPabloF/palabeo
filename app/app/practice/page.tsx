"use client"
import { useState, useEffect } from "react"
import QuizCard from "./components/quizCard"
import QuizResult from "./components/quizResult"

type Question = {
  questionNumber: number
  word: string
  answer: string
  options: string[]
}
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
  const totalQuestions = sampleQuestions.length

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question>(
    sampleQuestions[currentQuestionIndex]
  )

  const [score, setScore] = useState(0)
  const [status, setStatus] = useState("practice")
  function handleNextQuestion(correct: boolean) {
    // wait 1 second before showing the next question
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      if (correct) {
        setScore(score + 1)
      }
    }, 1000)
  }

  useEffect(() => {
    if (currentQuestionIndex < totalQuestions) {
      setCurrentQuestion(sampleQuestions[currentQuestionIndex])
    } else {
      //show the result
      setStatus("result")
    }
  }, [currentQuestionIndex])

  return (
    <>
      {status === "practice" ? (
        <QuizCard
          key={currentQuestionIndex}
          {...currentQuestion}
          totalQuestions={totalQuestions}
          nextQuestion={handleNextQuestion}
        />
      ) : (
        <QuizResult score={score} totalQuestions={totalQuestions} />
      )}
    </>
  )
}
