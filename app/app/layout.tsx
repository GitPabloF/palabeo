// import AppNav from "@/app/app/components/appNav"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/app/app/components/appSidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-gray-100 flex h-screen w-screen">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
