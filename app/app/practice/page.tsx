import QuizCard from "./components/quizCard"

const sampleQuestions = [
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
  const currentQuestion = sampleQuestions[3]

  return (
    <>
      <QuizCard
        word={currentQuestion.word}
        questionNumber={currentQuestion.questionNumber}
        totalQuestions={totalQuestions}
        answer={currentQuestion.answer}
        options={currentQuestion.options}
      />
    </>
  )
}
