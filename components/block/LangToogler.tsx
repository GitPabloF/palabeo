import { Button } from "@/components/ui/button"
import { ArrowRightLeft } from "lucide-react"
import type { LangCode } from "@/types/main"

type LangTooglerProps = {
  fromLang: LangCode
  toLang: LangCode
  setToLang: (lang: LangCode) => void
  setFromLang: (lang: LangCode) => void
}

export default function LangToogler({
  fromLang,
  toLang,
  setToLang,
  setFromLang,
}: LangTooglerProps) {
  function toggleDirection() {
    setFromLang(toLang)
    setToLang(fromLang)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 self-center flex items-center gap-2"
      onClick={toggleDirection}
    >
      <ArrowRightLeft className="w-4 h-4" />
      <span className="flex items-center gap-1">
        <span className="font-medium">{fromLang.toUpperCase()}</span>
        <span className="text-xs">→</span>
        <span className="font-medium">{toLang.toUpperCase()}</span>
      </span>
    </Button>
  )
}
