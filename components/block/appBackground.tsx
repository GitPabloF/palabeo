import { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AppBackgroundProps = {
  className?: string
  children?: ReactNode
  variant?: "gradient" | "grid"
  gridSize?: number
}

export default function AppBackground({
  className,
  children,
  variant = "grid",
  gridSize = 24,
}: AppBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
    >
      {variant === "gradient" ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50 to-indigo-100" />
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(800px_320px_at_15%_15%,rgba(59,130,246,0.22),transparent),radial-gradient(700px_300px_at_85%_10%,rgba(99,102,241,0.22),transparent)]" />
          <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />
          <div className="absolute top-40 -right-8 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
        </>
      ) : (
        <>
          {/* Subtle paper-like base */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100" />
          {/* Primary grid (higher contrast for visibility) */}
          <div
            className="absolute inset-0 [mask-image:radial-gradient(90%_80%_at_50%_45%,black,transparent)]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.08) 1px, transparent 1px)",
              backgroundSize: `${gridSize}px ${gridSize}px`,
            }}
          />
        </>
      )}
      {children}
    </div>
  )
}
