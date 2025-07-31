import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { BookOpen } from "lucide-react"

interface VocabularyHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function VocabularyHeader({
  searchTerm,
  onSearchChange,
}: VocabularyHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div
          className={`p-3 bg-gradient-to-br from-brand-orange/10 to-brand-orange/20 rounded-full`}
        >
          <BookOpen className={`w-6 h-6 text-brand-orange`} />
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-orange to-orange-600 bg-clip-text text-transparent">
          My Vocabulary
        </h1>
      </div>
      <div className="flex gap-2">
        <div className="relative text-gray-400">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5" />
          </span>
          <Input
            type="text"
            placeholder="Search Words..."
            className="pl-10 bg-white"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button
          className="bg-brand-orange/90 font-bold hover:bg-brand-orange cursor-pointer disabled:bg-brand-orange/70"
          asChild
        >
          <Link href="/app/add">
            <Image src="/icons/plus.svg" alt="Palabeo" width={14} height={14} />
            Add Word
          </Link>
        </Button>
      </div>
    </div>
  )
}
