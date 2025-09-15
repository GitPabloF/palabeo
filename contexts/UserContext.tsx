"use client"
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LangCode } from "@/types/main"

interface User {
  id: string
  email: string
  name: string | null
  userLanguage: LangCode
  learnedLanguage: LangCode
}

interface UserContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  loading: boolean
  refetchUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserData = async () => {
    if (!session?.user?.email) {
      setCurrentUser(null)
      setLoading(false)
      return
    }

    try {
      // get the current user
      const response = await fetch(`/api/users/me`)
      if (response.ok) {
        const userData = await response.json()
        setCurrentUser(userData)
      } else {
        console.error("Failed to fetch user data")
        setCurrentUser(null)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setCurrentUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading") {
      setLoading(true)
      return
    }

    if (status === "unauthenticated") {
      setCurrentUser(null)
      setLoading(false)
      // Redirect to login if we are in a protected page
      if (window.location.pathname.startsWith("/app")) {
        router.push("/login")
      }
      return
    }

    if (status === "authenticated" && session?.user?.email) {
      fetchUserData()
    }
  }, [session, status, router])

  const refetchUser = async () => {
    setLoading(true)
    await fetchUserData()
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        refetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
