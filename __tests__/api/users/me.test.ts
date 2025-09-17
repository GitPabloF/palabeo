import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { GET } from "@/app/api/users/me/route"
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
      findUnique: vi.fn(),
    },
  },
}))

const mockGetServerSession = vi.mocked(getServerSession)
const mockPrisma = vi.mocked(prisma)

describe("/api/users/me", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe("GET /api/users/me", () => {
    it("should return 401 for missing session", async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest("http://localhost:3000/api/users/me")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details).toBeDefined()
    })

    it("should return 401 for session without user", async () => {
      mockGetServerSession.mockResolvedValue({})

      const request = new NextRequest("http://localhost:3000/api/users/me")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details[0].field).toBe("session.user")
    })

    it("should return 401 for invalid email in session", async () => {
      const mockSession = {
        user: {
          email: "invalid-email",
          id: "c1234567890123456789012345",
          role: "USER",
          name: "John Doe",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const request = new NextRequest("http://localhost:3000/api/users/me")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "email")).toBe(true)
    })

    it("should return 401 for invalid user ID in session", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
          id: "invalid-id",
          role: "USER",
          name: "John Doe",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const request = new NextRequest("http://localhost:3000/api/users/me")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "userId")).toBe(true)
    })

    it("should return 401 for invalid role in session", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
          id: "c1234567890123456789012345",
          role: "INVALID_ROLE",
          name: "John Doe",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const request = new NextRequest("http://localhost:3000/api/users/me")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "role")).toBe(true)
    })

    it("should return 401 for invalid name in session", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
          id: "c1234567890123456789012345",
          role: "USER",
          name: "<script>alert('xss')</script>",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const request = new NextRequest("http://localhost:3000/api/users/me")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "name")).toBe(true)
    })

    it("should handle session with dangerous characters in email", async () => {
      const mockSession = {
        user: {
          email: '<script>alert("xss")</script>test@example.com',
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const request = new NextRequest("http://localhost:3000/api/users/me")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "email")).toBe(true)
    })

    it("should handle session with HTML tags in name", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
          name: "<div>John</div>Doe",
        },
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const request = new NextRequest("http://localhost:3000/api/users/me")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "name")).toBe(true)
    })
  })
})
