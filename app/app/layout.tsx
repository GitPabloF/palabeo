// import AppNav from "@/app/app/components/appNav"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/app/app/components/appSidebar"
import { UserProvider } from "@/contexts/UserContext"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="bg-gray-100 flex h-screen w-screen">
          <SidebarTrigger />
          <div className="flex-1">{children}</div>
        </main>
      </SidebarProvider>
    </UserProvider>
  )
}
