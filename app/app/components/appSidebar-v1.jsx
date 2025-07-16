import Link from "next/link"
import Image from "next/image"
import { FEATURES } from "@/content/main"

export default function AppSidebar() {
  return (
    <div className="w-3xs bg-white border-1 border-gray-300">
      {/* Brand/Logo */}
      <Link
        href="/app"
        className="flex items-center gap-2 py-3 px-5"
        aria-label="Go to main app page"
      >
        <Image src="/logo.svg" alt="Palabeo" width={42} height={42} priority />
        <h1 className="text-2xl text-brand-orange font-bold">palabeo</h1>
      </Link>

      {/* Navigation */}
      <nav aria-label="Main navigation">
        <ul>
          {FEATURES.map((feature) => (
            <li key={feature.id}>
              <Link
                href={feature.path}
                className="flex bg-brand-orange gap-2 items-center py-2 px-5"
              >
                {/* ICON */}
                <div className="bg-white/20 rounded-lg w-[32] h-[32] flex align-center justify-center">
                  <Image
                    src={`/icons/${feature.icon}.svg`}
                    alt={feature.name}
                    width={16}
                    height={15}
                    priority
                  />
                </div>
                {/* feature NAME */}
                <span className="uppercase text-white font-medium text-base">
                  {feature.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
