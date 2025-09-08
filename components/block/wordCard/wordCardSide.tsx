import AppAlertDialog from "@/components/block/appAlertDialog"
import WordCardHeader from "./wordCardHeader"
import WordCardFooter from "./wordCardFooter"
import WordCardContent from "./wordCardContent"
import { LangCode } from "@/types/main"
import { getTypeColors } from "@/utils/wordTypeColors"
// import { Trash } from "lucide-react"

type CardSideProps = {
  side: "front" | "back"
  word: string
  example?: string
  lang: LangCode
  typeName?: string
  colors?: ReturnType<typeof getTypeColors>
  id?: number
  createdAt?: string
  status?: string
  onDelete?: (id: number) => void
  isHovered?: boolean
}

export default function WordCardSide({
  side,
  word,
  example,
  lang,
  typeName,
  colors,
  id,
  createdAt,
  status,
  onDelete,
  isHovered = false,
}: CardSideProps) {
  const isFront = side === "front"

  const cardStyles = isFront
    ? `relative w-full h-full rounded-[28px] shadow-2xl border-[6px] ${
        colors?.border
      } overflow-hidden group transition-all duration-300 ${
        isHovered ? `${colors?.glow} shadow-2xl` : "shadow-xl"
      }`
    : "relative w-full h-full rounded-[28px] shadow-xl border-[6px] border-gray-300 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden"

  const backgroundElements = isFront ? (
    <>
      {/* Base gradient */}
      <div className={`absolute inset-0 ${colors?.bg} opacity-95`} />
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_20%_10%,#fff,transparent_30%),radial-gradient(circle_at_80%_20%,#fff,transparent_25%),radial-gradient(circle_at_50%_80%,#fff,transparent_30%)]" />
      {/* Holographic foil sweep */}
      <div
        className={`absolute inset-0 [background:conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.0),rgba(255,255,255,0.22),rgba(255,255,255,0.0))] mix-blend-soft-light opacity-70 transition-transform duration-700 ${
          isHovered ? "translate-x-0" : "-translate-x-4"
        }`}
      />
    </>
  ) : (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-200" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent)]" />
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
    </>
  )

  return (
    <div className={cardStyles}>
      {backgroundElements}

      {/* Action Button - */}

      {/* TODO: Handle delete button another way */}
      {/* {status === "added" && (
        <div className="absolute top-3 right-3 z-20">
          <AppAlertDialog
            title="Delete this word?"
            description="This word will be permanently removed from your collection. This action cannot be undone."
            onConfirm={() => onDelete?.(id)}
          >
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-110">
              <Trash size={16} className="text-red" />
            </button>
          </AppAlertDialog>
        </div>
      )} */}

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <WordCardHeader
          label={isFront ? typeName || "" : "Translation"}
          isFront={isFront}
        />

        <WordCardContent
          word={word}
          example={example}
          lang={lang}
          isFront={isFront}
        />

        <WordCardFooter
          isFront={isFront}
          id={id}
          createdAt={createdAt}
          status={status}
        />
      </div>
    </div>
  )
}
