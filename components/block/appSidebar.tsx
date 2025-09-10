"use client"
import Link from "next/link"
import Image from "next/image"

import { usePathname } from "next/navigation"
import { FEATURES } from "@/content/main"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User2 } from "lucide-react"
import { ChevronUp } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useSession, signOut } from "next-auth/react"
import { useUser } from "@/contexts/UserContext"

export default function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { currentUser } = useUser()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <Sidebar>
      <SidebarHeader>
        {/* Brand/Logo */}
        <Link
          href="/app"
          className="flex items-center gap-2 py-3 px-5"
          aria-label="Go to main app page"
        >
          <Image
            src="/logo.svg"
            alt="Palabeo"
            width={42}
            height={42}
            priority
          />
          <h1 className="text-2xl text-brand-orange font-bold">palabeo</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {FEATURES.map((feature) => {
                const isActive = pathname === `/app/${feature.path}`
                return (
                  <SidebarMenuItem key={feature.id}>
                    <SidebarMenuButton
                      asChild
                      className={`hover:text-brand-orange hover:font-extrabold transition-colors ${
                        isActive
                          ? "bg-brand-orange/10 font-extrabold text-brand-orange"
                          : ""
                      }`}
                    >
                      <Link
                        href={`/app/${feature.path}`}
                        className="transition-colors duration-200 py-2 px-5"
                      >
                        <span className="flex items-center gap-2 transition-transform peer-hover/menu-button:translate-x-2">
                          {feature.icon && <feature.icon className="w-5 h-5" />}
                          <span className="capitalize font-semibold text-base text-gray-600">
                            {feature.name}
                          </span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {currentUser?.name || currentUser?.email || "User"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
