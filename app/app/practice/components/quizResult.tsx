export default function QuizResult({
  score,
  totalQuestions,
}: {
  score: number
  totalQuestions: number
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Quiz Result</h1>
      <p className="text-4xl font-bold">
        {score}/{totalQuestions}
      </p>
      <button className="bg-blue-500 text-white p-2 rounded-md">Restart</button>
    </div>
  )
}
