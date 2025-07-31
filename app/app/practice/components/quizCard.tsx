"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardAction } from "@/components/ui/card"
import CountdownProgress from "@/components/ui/countdownProgress"
import { useState } from "react"

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

  function handleCompleted() {
    setStatus("timeout")
    nextQuestion(false)
  }

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

  function setColor(option: string) {
    if (status === "correct" && option === answer) {
      return "bg-green-500 text-white hover:bg-green-600 hover:text-white"
    }
    if (status === "wrong" && option === selectedValue) {
      return "bg-red-500 text-white hover:bg-red-600 hover:text-white"
    }
    return "text-black"
  }

  return (
    <Card className="gap-15">
      <CardContent className="flex justify-between items-center">
        <span className="inline-block">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="w-2/5 max-w-80">
          <CountdownProgress
            duration={10000}
            onComplete={handleCompleted}
            canPlay={status === "playing"}
          />
        </div>
      </CardContent>

      <CardContent>
        <div className="flex flex-col gap-2">
          <p className="text-center">
            What is the translation of: <br />
            <span className="font-bold text-2xl capitalize block text-brand-orange">
              {word}
            </span>
          </p>
        </div>
      </CardContent>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <Button
              variant="outline"
              className={`${setColor(option)}`}
              key={option}
              onClick={() => handleChoice(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
