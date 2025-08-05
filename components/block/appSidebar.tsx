"use client"
import Link from "next/link"
import Image from "next/image"

import { usePathname } from "next/navigation"
import { FEATURES } from "@/content/main"

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

export default function AppSidebar() {
  const pathname = usePathname()

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
      <SidebarFooter />
    </Sidebar>
  )
}
