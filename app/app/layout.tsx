import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/app/app/components/appSidebar"
import { UserProvider } from "@/contexts/UserContext"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="relative bg-gray-100 min-h-screen w-screen flex-1 flex">
          <div className="flex-1  min-h-screen pb-5 flex flex-col gap-6 mx-10 py-8">
            <SidebarTrigger />
            <div className="max-w-[900px] w-full items-center flex-1 self-center">
              {children}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </UserProvider>
  )
}
