import Link from "next/link"
import Image from "next/image"
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
              {FEATURES.map((feature) => (
                <SidebarMenuItem key={feature.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/app/${feature.path}`}
                      className="transition-colors duration-200 py-2 px-5
                       hover:text-white"
                    >
                      {/* ICON */}
                      <div
                        className={`${feature.color} rounded-lg w-[32] h-[32] flex align-center justify-center`}
                      >
                        <Image
                          src={`/icons/${feature.icon}.svg`}
                          alt={feature.name}
                          width={16}
                          height={15}
                          priority
                        />
                      </div>
                      {/* feature NAME */}
                      <span className={`uppercase font-semibold text-base`}>
                        {feature.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
