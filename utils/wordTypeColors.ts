import { WordTypeCode } from "@/types/main"

// Utility functions
export const getTypeColors = (type: keyof typeof TYPE_COLORS) => {
  return TYPE_COLORS[type] ?? DEFAULT_COLORS
}

const TYPE_COLORS: Record<
  WordTypeCode,
  {
    bg: string
    text: string
    border: string
    gradient: string
    rarity: string
    glow: string
  }
> = {
  v: {
    bg: "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400",
    text: "text-white",
    border: "border-blue-400",
    gradient: "from-blue-500 via-cyan-400 to-blue-600",
    rarity: "bg-gradient-to-r from-blue-400 to-cyan-300",
    glow: "shadow-blue-500/50",
  },
  nf: {
    bg: "bg-gradient-to-br from-yellow-600 via-yellow-500 to-orange-400",
    text: "text-white",
    border: "border-yellow-400",
    gradient: "from-yellow-500 via-orange-400 to-yellow-600",
    rarity: "bg-gradient-to-r from-yellow-400 to-orange-300",
    glow: "shadow-yellow-500/50",
  },
  nm: {
    bg: "bg-gradient-to-br from-yellow-600 via-yellow-500 to-orange-400",
    text: "text-white",
    border: "border-yellow-400",
    gradient: "from-yellow-500 via-orange-400 to-yellow-600",
    rarity: "bg-gradient-to-r from-yellow-400 to-orange-300",
    glow: "shadow-yellow-500/50",
  },
  adj: {
    bg: "bg-gradient-to-br from-purple-600 via-purple-500 to-pink-400",
    text: "text-white",
    border: "border-purple-400",
    gradient: "from-purple-500 via-pink-400 to-purple-600",
    rarity: "bg-gradient-to-r from-purple-400 to-pink-300",
    glow: "shadow-purple-500/50",
  },
  adv: {
    bg: "bg-gradient-to-br from-violet-600 via-violet-500 to-purple-400",
    text: "text-white",
    border: "border-violet-400",
    gradient: "from-violet-500 via-purple-400 to-violet-600",
    rarity: "bg-gradient-to-r from-violet-400 to-purple-300",
    glow: "shadow-violet-500/50",
  },
  pron: {
    bg: "bg-gradient-to-br from-pink-600 via-pink-500 to-rose-400",
    text: "text-white",
    border: "border-pink-400",
    gradient: "from-pink-500 via-rose-400 to-pink-600",
    rarity: "bg-gradient-to-r from-pink-400 to-rose-300",
    glow: "shadow-pink-500/50",
  },
}

const DEFAULT_COLORS = {
  bg: "bg-gradient-to-br from-gray-600 via-gray-500 to-slate-400",
  text: "text-white",
  border: "border-gray-400",
  gradient: "from-gray-500 via-slate-400 to-gray-600",
  rarity: "bg-gradient-to-r from-gray-400 to-slate-300",
  glow: "shadow-gray-500/50",
}
