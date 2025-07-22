import { Eye, EyeClosed, Trash, FilePenLine } from "lucide-react"

type ShowButtonProps = {
  showTranslation: boolean
  setShowTranslation: (value: boolean | ((prev: boolean) => boolean)) => void
  type?: "single" | "multiple"
}
export default function ShowButton({
  showTranslation,
  setShowTranslation,
  type,
}: ShowButtonProps) {
  const hideText =
    type == "multiple" ? "Hide All Translations" : "Hide Translation"

  const showText =
    type == "single" ? "Show All Translations" : "Show Translation"
  return (
    <button
      className="text-blue-400 text-sm font-bold gap-2 hover:text-blue-600 flex items-center cursor-pointer"
      onClick={() => setShowTranslation((v) => !v)}
    >
      <div className="relative w-6 h-6  translate-x-1/6">
        <Eye
          className={`
          absolute top-0 left-0 w-full h-full
          transition-opacity duration-200 ease-in-out
          ${!showTranslation ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        />
        <EyeClosed
          className={`
          absolute top-0 left-0 w-full h-full
          transition-opacity duration-200 ease-in-out
          ${showTranslation ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        />
      </div>
      <div>
        <span>{showTranslation ? hideText : showText}</span>
      </div>
    </button>
  )
}
