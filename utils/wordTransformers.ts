import { Word } from "@/lib/generated/prisma"
import { Word as WordType } from "@/types/main"

export function transformWordForCard(word: Word): WordType {
  return {
    id: word.id,
    word: { from: word.wordFrom, to: word.wordTo },
    type: { name: word.typeName, type: word.typeCode },
    lang: { from: word.langFrom, to: word.langTo },
    example: { from: word.exampleFrom, to: word.exampleTo },
    createdAt:
      typeof word.createdAt === "string"
        ? word.createdAt
        : word.createdAt.toISOString(),
  }
}
