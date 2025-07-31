"use client"
import QuizCard from "./components/quizCard"
import QuizResult from "./components/quizResult"
import { useQuizGame } from "@/hooks/useQuizGame"
import type { Question } from "@/types/main"
import { useUser } from "@/contexts/UserContext"
import { useWords } from "@/hooks/useWords"
import { Brain, Sparkles } from "lucide-react"
import PageHeader from "@/components/ui/pageHeader"

const sampleQuestions: Question[] = [
  {
    questionNumber: 1,
    word: "falda",
    answer: "skirt",
    options: ["skirt", "pants", "shorts", "dress"],
  },
  {
    questionNumber: 2,
    word: "zapato",
    answer: "shoe",
    options: ["shoe", "boot", "sandals", "slipper"],
  },
  {
    questionNumber: 3,
    word: "sombrero",
    answer: "hat",
    options: ["hat", "cap", "glove", "scarf"],
  },
  {
    questionNumber: 4,
    word: "casa",
    answer: "house",
    options: ["house", "car", "bike", "train"],
  },
  {
    questionNumber: 5,
    word: "coche",
    answer: "car",
    options: ["car", "bike", "train", "plane"],
  },
  {
    questionNumber: 6,
    word: "casa",
    answer: "house",
    options: ["house", "car", "bike", "train"],
  },
]

//
const isGameComplete = true
const sampleTest = {
  score: 3,
  totalQuestions: 6,
  wrongWordsData: [
    {
      id: 8,
      wordFrom: "car",
      wordTo: "coche",
      exampleFrom: "The car sped down the highway.",
      exampleTo: "El coche iba a toda velocidad por la carretera.",
      langFrom: "en",
      langTo: "es",
      typeCode: "nm",
      typeName: "noun masculine",
      createdAt: "2025-07-31T13:41:07.217Z",
      userId: "cmdopvcgj0000v1ckd5h4x3e9",
      lastReviewed: null,
      reviewCount: 0,
      mastered: false,
      user: {
        name: "Test User",
        email: "test@example.com",
      },
    },
    {
      id: 6,
      wordFrom: "house",
      wordTo: "casa",
      exampleFrom: "Their new house has three bathrooms.",
      exampleTo: "Su nueva casa tiene tres baños.",
      langFrom: "en",
      langTo: "es",
      typeCode: "nf",
      typeName: "noun feminine",
      createdAt: "2025-07-31T13:40:52.410Z",
      userId: "cmdopvcgj0000v1ckd5h4x3e9",
      lastReviewed: null,
      reviewCount: 0,
      mastered: false,
      user: {
        name: "Test User",
        email: "test@example.com",
      },
    },
  ],
}

export default function PracticePage() {
  const { currentUser } = useUser()
  const { words } = useWords(currentUser?.id)

  const {
    currentQuestion,
    score,
    totalQuestions,
    isGameComplete,
    questionIndex,
    handleNextQuestion,
    wrongWordsData,
  } = useQuizGame(sampleQuestions, words)

  if (isGameComplete) {
    return (
      <div className="max-w-[900px] mx-auto pt-8 pb-8 px-4">
        <QuizResult
          score={score}
          totalQuestions={totalQuestions}
          wrongWordsData={wrongWordsData}
        />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Quiz Challenge"
        description="Test your knowledge! Choose the correct translation before time runs out.."
        leftIcon={Brain}
        rightIcon={Sparkles}
      />

      {/* Quiz Card */}
      <div className="flex justify-center">
        <QuizCard
          key={questionIndex}
          {...currentQuestion}
          totalQuestions={totalQuestions}
          nextQuestion={handleNextQuestion}
        />
      </div>
    </>
  )
}
