"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardAction } from "@/components/ui/card"
import CountdownProgress from "@/components/ui/countdownProgress"
import { useState } from "react"
import { Clock, Target, CheckCircle, XCircle } from "lucide-react"

type QuizCardProps = {
  word: string
  questionNumber: number
  totalQuestions: number
  answer: string
  options: string[]
  nextQuestion: (correct: boolean) => void
}

export default function QuizCard({
  word,
  questionNumber,
  totalQuestions,
  answer,
  options,
  nextQuestion,
}: QuizCardProps) {
  const [status, setStatus] = useState<
    "playing" | "wrong" | "correct" | "timeout"
  >("playing")
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  /**
   * Handle the completion of the game
   * @returns void
   */
  function handleCompleted() {
    setStatus("timeout")
    nextQuestion(false)
  }

  /**
   * Handle the choice of the user
   * if the choice is correct, set the status to correct and call the nextQuestion function with true
   * if the choice is incorrect, set the status to wrong and call the nextQuestion function with false
   * @param choice - The choice of the user
   * @returns void
   */
  function handleChoice(choice: string) {
    if (!choice || status !== "playing") return

    setSelectedValue(choice)

    if (choice === answer) {
      setStatus("correct")
      nextQuestion(true)
    } else {
      setStatus("wrong")
      nextQuestion(false)
    }
  }

  /**
   * Set the color of the button based on the status of the game
   * @param option - The option of the user
   * @returns string
   */
  function setColor(option: string) {
    if (status === "correct" && option === answer) {
      return "bg-green-500 text-white hover:bg-green-600 hover:text-white border-green-500 shadow-lg scale-100 transition-all duration-200"
    }
    if (status === "wrong" && option === selectedValue) {
      return "bg-red-500 text-white hover:bg-red-600 hover:text-white border-red-500 shadow-lg scale-100 transition-all duration-200"
    }
    if (status === "wrong" && option === answer) {
      return "bg-green-500 text-white border-green-500 shadow-lg scale-100 transition-all duration-200"
    }
    return "text-black hover:bg-brand-orange/10 hover:border-brand-orange/30 transition-all duration-200"
  }

  const getStatusMessage = () => {
    if (status === "correct") {
      return "🎉 Congratulations ! You got it right !"
    }
    if (status === "wrong") {
      return "💡 Don't worry, we learn from our mistakes !"
    }
    if (status === "timeout") {
      return "⏰ Time's up !"
    }
    return ""
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50">
      {/* Header with progress and timer */}
      <CardContent className="flex justify-between items-center p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-orange" />
            <span className="text-sm font-medium text-slate-700">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-orange" />
          <div className="w-32">
            <CountdownProgress
              duration={10000}
              onComplete={handleCompleted}
              canPlay={status === "playing"}
            />
          </div>
        </div>
      </CardContent>

      {/* Question Section */}
      <CardContent className="px-6 py-4">
        <div className="text-center space-y-4">
          <p className="text-lg text-slate-700 font-bold">
            Can you guess the word ?
          </p>

          <div className="bg-gradient-to-r from-brand-orange/10 to-orange-500/10 rounded-2xl p-6 border border-brand-orange/20">
            <span className="font-bold text-3xl capitalize text-brand-orange">
              {word}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Status Message */}
      {status !== "playing" && (
        <CardContent className="px-6 py-2">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {getStatusMessage()}
            </p>
          </div>
        </CardContent>
      )}

      {/* Options Section */}
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => (
            <Button
              variant="outline"
              className={`h-14 text-base font-medium ${setColor(option)} ${
                status === "playing" ? "hover:scale-105" : ""
              }`}
              key={option}
              onClick={() => handleChoice(option)}
              disabled={status !== "playing"}
            >
              {option}
              {status === "correct" && option === answer && (
                <CheckCircle className="w-5 h-5 ml-2" />
              )}
              {status === "wrong" && option === selectedValue && (
                <XCircle className="w-5 h-5 ml-2" />
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
