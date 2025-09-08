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
    bg: "bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500",
    text: "text-white",
    border: "border-blue-300",
    gradient: "from-blue-500 via-cyan-400 to-indigo-600",
    rarity: "bg-gradient-to-r from-blue-300 to-cyan-200",
    glow: "shadow-blue-400/60",
  },
  nf: {
    bg: "bg-gradient-to-br from-amber-700 via-amber-600 to-orange-500",
    text: "text-white",
    border: "border-amber-300",
    gradient: "from-amber-500 via-orange-400 to-amber-700",
    rarity: "bg-gradient-to-r from-amber-300 to-orange-200",
    glow: "shadow-amber-400/60",
  },
  nm: {
    bg: "bg-gradient-to-br from-amber-700 via-amber-600 to-orange-500",
    text: "text-white",
    border: "border-amber-300",
    gradient: "from-amber-500 via-orange-400 to-amber-700",
    rarity: "bg-gradient-to-r from-amber-300 to-orange-200",
    glow: "shadow-amber-400/60",
  },
  adj: {
    bg: "bg-gradient-to-br from-fuchsia-700 via-purple-600 to-pink-500",
    text: "text-white",
    border: "border-fuchsia-300",
    gradient: "from-fuchsia-500 via-pink-400 to-purple-700",
    rarity: "bg-gradient-to-r from-fuchsia-300 to-pink-200",
    glow: "shadow-fuchsia-400/60",
  },
  adv: {
    bg: "bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500",
    text: "text-white",
    border: "border-violet-300",
    gradient: "from-violet-500 via-purple-400 to-violet-700",
    rarity: "bg-gradient-to-r from-violet-300 to-purple-200",
    glow: "shadow-violet-400/60",
  },
  pron: {
    bg: "bg-gradient-to-br from-rose-700 via-rose-600 to-pink-500",
    text: "text-white",
    border: "border-rose-300",
    gradient: "from-rose-500 via-pink-400 to-rose-700",
    rarity: "bg-gradient-to-r from-rose-300 to-pink-200",
    glow: "shadow-rose-400/60",
  },
}

const DEFAULT_COLORS = {
  bg: "bg-gradient-to-br from-gray-700 via-gray-600 to-slate-500",
  text: "text-white",
  border: "border-gray-300",
  gradient: "from-gray-500 via-slate-400 to-gray-700",
  rarity: "bg-gradient-to-r from-gray-300 to-slate-200",
  glow: "shadow-gray-400/60",
}
