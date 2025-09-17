import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/users/route"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

// Mock NextAuth
vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}))

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

const mockGetServerSession = vi.mocked(getServerSession)
const mockPrisma = vi.mocked(prisma)

describe("/api/users", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe("GET /api/users", () => {
    it("should return 401 for missing session", async () => {
      mockGetServerSession.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details[0].field).toBe("session")
    })

    it("should return 401 for invalid session data", async () => {
      const mockSession = {
        user: {
          email: "invalid-email",
          id: "invalid-id",
          role: "INVALID_ROLE",
          name: "<script>alert('xss')</script>",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details).toBeDefined()
    })

    it("should return 401 for invalid email in session", async () => {
      const mockSession = {
        user: {
          email: "invalid-email",
          id: "c1234567890123456789012345",
          role: "USER",
          name: "Regular User",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "email")).toBe(true)
    })

    it("should return 401 for invalid user ID in session", async () => {
      const mockSession = {
        user: {
          email: "user@example.com",
          id: "invalid-id",
          role: "USER",
          name: "Regular User",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "userId")).toBe(true)
    })

    it("should return 401 for invalid role in session", async () => {
      const mockSession = {
        user: {
          email: "user@example.com",
          id: "c1234567890123456789012345",
          role: "INVALID_ROLE",
          name: "Regular User",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "role")).toBe(true)
    })

    it("should return 401 for invalid name in session", async () => {
      const mockSession = {
        user: {
          email: "user@example.com",
          id: "c1234567890123456789012345",
          role: "USER",
          name: "<script>alert('xss')</script>",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "name")).toBe(true)
    })
  })

  describe("POST /api/users", () => {
    it("should return 401 for missing session", async () => {
      mockGetServerSession.mockResolvedValue(null)

      const userData = {
        email: "newuser@example.com",
        name: "New User",
      }

      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details[0].field).toBe("session")
    })

    it("should return 401 for invalid session data", async () => {
      const mockSession = {
        user: {
          email: "invalid-email",
          id: "invalid-id",
          role: "INVALID_ROLE",
          name: "<script>alert('xss')</script>",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const userData = {
        email: "newuser@example.com",
        name: "New User",
      }

      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
    })

    it("should return 401 for invalid email in session", async () => {
      const mockSession = {
        user: {
          email: "invalid-email",
          id: "c1234567890123456789012345",
          role: "USER",
          name: "Regular User",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const userData = {
        email: "newuser@example.com",
        name: "New User",
      }

      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "email")).toBe(true)
    })

    it("should return 401 for invalid user ID in session", async () => {
      const mockSession = {
        user: {
          email: "user@example.com",
          id: "invalid-id",
          role: "USER",
          name: "Regular User",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const userData = {
        email: "newuser@example.com",
        name: "New User",
      }

      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "userId")).toBe(true)
    })

    it("should return 401 for invalid role in session", async () => {
      const mockSession = {
        user: {
          email: "user@example.com",
          id: "c1234567890123456789012345",
          role: "INVALID_ROLE",
          name: "Regular User",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const userData = {
        email: "newuser@example.com",
        name: "New User",
      }

      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "role")).toBe(true)
    })

    it("should return 401 for invalid name in session", async () => {
      const mockSession = {
        user: {
          email: "user@example.com",
          id: "c1234567890123456789012345",
          role: "USER",
          name: "<script>alert('xss')</script>",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const userData = {
        email: "newuser@example.com",
        name: "New User",
      }

      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "name")).toBe(true)
    })

    it("should handle session with dangerous characters in email", async () => {
      const mockSession = {
        user: {
          email: '<script>alert("xss")</script>user@example.com',
          id: "c1234567890123456789012345",
          role: "USER",
          name: "Regular User",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const userData = {
        email: "newuser@example.com",
        name: "New User",
      }

      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "email")).toBe(true)
    })

    it("should handle session with HTML tags in name", async () => {
      const mockSession = {
        user: {
          email: "user@example.com",
          id: "c1234567890123456789012345",
          role: "USER",
          name: "<div>John</div>Doe",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const userData = {
        email: "newuser@example.com",
        name: "New User",
      }

      const request = new NextRequest("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "name")).toBe(true)
    })
  })
})
