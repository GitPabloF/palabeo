import type { Question } from "@/types/main"

import { useState } from "react"

export function useQuizGame(questions: Question[]) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)

  const totalQuestions = questions.length
  const currentQuestion = questions[questionIndex]
  const isGameComplete = questionIndex >= totalQuestions

  /**
   * Handle the next question and the score
   * if the answer is correct, add 1 to the score
   * if the answer is incorrect, do nothing
   * @param correct - The correct answer
   * @returns void
   */
  function handleNextQuestion(correct: boolean) {
    // wait 1 second before showing the next question
    setTimeout(() => {
      const nextIndex = questionIndex + 1
      setQuestionIndex(nextIndex)
      if (correct) {
        setScore(score + 1)
      }
    }, 1000)
  }

  return {
    currentQuestion,
    questionIndex,
    score,
    totalQuestions,
    isGameComplete,
    handleNextQuestion,
  }
}
