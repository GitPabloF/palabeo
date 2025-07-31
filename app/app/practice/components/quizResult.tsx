import { useEffect } from "react"

import WordCard from "@/components/block/wordCard"
import type { Word } from "@/types/main"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
export default function QuizResult({
  score,
  totalQuestions,
  wrongWordsData,
}: {
  score: number
  totalQuestions: number
  wrongWordsData: Word[]
}) {
  useEffect(() => {
    console.log({ score, totalQuestions, wrongWordsData })
  }, [])
  return (
    <div>
      <Card className="gap-15">
        <CardContent>
          <h1 className="text-2xl font-bold">Quiz Result</h1>
          <p className="text-4xl font-bold">
            {score}/{totalQuestions}
          </p>
          <button className="bg-blue-500 text-white p-2 rounded-md">
            Restart
          </button>
        </CardContent>
      </Card>
      <div className="w-full h-full">
        <h2 className="text-2xl font-bold">
          These are the words you got wrong - {wrongWordsData.length}
        </h2>
        <ScrollArea className="flex-1 flex px-10 mt-7  rounded-2xl">
          <div className="flex-1 flex flex-col gap-5">
            {wrongWordsData.map((word) => (
              <WordCard key={word.id} {...word} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
