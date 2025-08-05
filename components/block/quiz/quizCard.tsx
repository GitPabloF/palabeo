"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardAction } from "@/components/ui/card"
import CountdownProgress from "@/components/ui/countdownProgress"
import { useState } from "react"
import { Clock, Target, CheckCircle, XCircle } from "lucide-react"
import { useAutoAnimate } from "@formkit/auto-animate/react"

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
  const [parent] = useAutoAnimate()

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
      return "bg-gradient-to-r from-emerald-400/90 to-emerald-500/90 text-white hover:from-emerald-500/95 hover:to-emerald-600/95 border-emerald-400/50 shadow-lg shadow-emerald-500/25 backdrop-blur-sm transition-all duration-300"
    }
    if (status === "wrong" && option === selectedValue) {
      return "bg-gradient-to-r from-red-400/90 to-red-500/90 text-white hover:from-red-500/95 hover:to-red-600/95 border-red-400/50 shadow-lg shadow-red-500/25 backdrop-blur-sm transition-all duration-300"
    }
    if (status === "wrong" && option === answer) {
      return "bg-gradient-to-r from-emerald-400/90 to-emerald-500/90 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/25 backdrop-blur-sm transition-all duration-300"
    }
    return "bg-white/70 hover:bg-white/90 text-slate-700 hover:text-slate-900 border-white/50 hover:border-brand-orange/40 shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-300"
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
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-transparent to-orange-500/20 rounded-3xl blur-3xl -z-10"></div>

      <Card
        className="relative w-full backdrop-blur-xl bg-white/80 border border-white/30 shadow-2xl shadow-black/10 rounded-3xl overflow-hidden"
        ref={parent}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-brand-orange/5 pointer-events-none"></div>

        {/* Header with progress and timer */}
        <CardContent className="relative flex justify-between items-center p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/30">
              <Target className="w-4 h-4 text-brand-orange" />
              <span className="text-sm font-medium text-slate-700">
                Question {questionNumber} of {totalQuestions}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/30">
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
        <CardContent className="relative px-6 py-4">
          <div className="text-center space-y-4">
            <p className="text-lg text-slate-700 font-bold">
              Can you guess the word ?
            </p>

            <div className="relative bg-gradient-to-r from-brand-orange/20 via-orange-400/15 to-orange-500/20 rounded-3xl p-6 border border-brand-orange/30 backdrop-blur-sm shadow-lg shadow-brand-orange/10">
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-orange-500/10 rounded-3xl blur-sm"></div>
              <span className="relative font-bold text-3xl capitalize text-brand-orange drop-shadow-sm">
                {word}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Options Section */}
        <CardContent className="relative px-6 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {options.map((option) => (
              <Button
                variant="outline"
                className={`h-14 text-base font-medium rounded-2xl border-2 ${setColor(
                  option
                )} ${
                  status === "playing" ? "hover:scale-105 hover:shadow-xl" : ""
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

        {/* Status Message */}
        {status !== "playing" && (
          <CardContent className="relative px-6 py-2">
            <div className="text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30 inline-block">
                <p className="text-sm font-medium text-slate-700">
                  {getStatusMessage()}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
