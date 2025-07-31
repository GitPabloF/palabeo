import type { Question, Word } from "@/types/main"

import { useState } from "react"

export function useQuizGame(questions: Question[], words: Word[]) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [wrongWords, setWrongWords] = useState<string[]>([])

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
      if (correct) {
        setScore(score + 1)
      } else {
        setWrongWords([...wrongWords, currentQuestion.word])
      }
      const nextIndex = questionIndex + 1
      setQuestionIndex(nextIndex)
    }, 1000)
  }

  /**
   * Get the wrong words data
   * @returns Word[]
   */
  const wrongWordsData = words.filter((word) => {
    return (
      wrongWords.includes(word.wordFrom) || wrongWords.includes(word.wordTo)
    )
  })

  return {
    currentQuestion,
    questionIndex,
    score,
    totalQuestions,
    isGameComplete,
    wrongWordsData,
    handleNextQuestion,
  }
}
