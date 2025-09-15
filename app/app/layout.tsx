import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/block/appSidebar"
import { UserProvider } from "@/contexts/UserContext"
import AppBackground from "@/components/block/appBackground"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <AppBackground />

      <main className="relative min-h-screen w-screen flex-1 flex">
        <div className="flex-1  min-h-screen pb-5 flex flex-col gap-6 mx-10 py-8">
          <SidebarTrigger />
          <div className="max-w-[900px] w-full items-center flex-1 self-center">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
