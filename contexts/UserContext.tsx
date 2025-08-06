"use client"
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react"
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
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // for the moment add the default test user

    const defaultUser: User = {
      id: "cmdopvcgj0000v1ckd5h4x3e9",
      email: "test@example.com",
      name: "Pablo F",
      userLanguage: "en",
      learnedLanguage: "es",
    }

    setCurrentUser(defaultUser)
    setLoading(false)
  }, [])

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
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
