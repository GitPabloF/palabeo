import { Library, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import PageHeader from "@/components/block/pageHeader"

interface VocabularyHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function VocabularyHeader({
  searchTerm,
  onSearchChange,
}: VocabularyHeaderProps) {
  return (
    <div className="flex flex-col justify-between items-center">
      <PageHeader
        title="Collection"
        description="All your cards"
        colorType="adj"
        icon={Library}
      />
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
