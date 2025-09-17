import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { POST } from "@/app/api/auth/register/route"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

// Mock bcrypt
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
  },
}))

const mockPrisma = vi.mocked(prisma)
const mockBcrypt = vi.mocked(bcrypt)

describe("/api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe("POST /api/auth/register", () => {
    it("should return 400 for invalid JSON", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: "invalid json",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid JSON in request body")
    })

    it("should return 400 for missing email", async () => {
      const userData = {
        password: "ValidPass123!",
        name: "John Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "email")).toBe(true)
    })

    it("should return 400 for missing password", async () => {
      const userData = {
        email: "test@example.com",
        name: "John Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "password")).toBe(true)
    })

    it("should return 400 for invalid email format", async () => {
      const userData = {
        email: "invalid-email",
        password: "ValidPass123!",
        name: "John Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "email")).toBe(true)
    })

    it("should return 400 for weak password (too short)", async () => {
      const userData = {
        email: "test@example.com",
        password: "weak",
        name: "John Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(
        data.details.some(
          (e: any) => e.field === "password" && e.code === "TOO_SHORT"
        )
      ).toBe(true)
    })

    it("should return 400 for weak password (no uppercase)", async () => {
      const userData = {
        email: "test@example.com",
        password: "validpass123!",
        name: "John Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(
        data.details.some(
          (e: any) => e.field === "password" && e.code === "MISSING_UPPERCASE"
        )
      ).toBe(true)
    })

    it("should return 400 for weak password (no lowercase)", async () => {
      const userData = {
        email: "test@example.com",
        password: "VALIDPASS123!",
        name: "John Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(
        data.details.some(
          (e: any) => e.field === "password" && e.code === "MISSING_LOWERCASE"
        )
      ).toBe(true)
    })

    it("should return 400 for weak password (no number)", async () => {
      const userData = {
        email: "test@example.com",
        password: "ValidPass!",
        name: "John Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(
        data.details.some(
          (e: any) => e.field === "password" && e.code === "MISSING_NUMBER"
        )
      ).toBe(true)
    })

    it("should return 400 for weak password (no special character)", async () => {
      const userData = {
        email: "test@example.com",
        password: "ValidPass123",
        name: "John Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(
        data.details.some(
          (e: any) =>
            e.field === "password" && e.code === "MISSING_SPECIAL_CHAR"
        )
      ).toBe(true)
    })

    it("should return 400 for common password", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        name: "John Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(
        data.details.some(
          (e: any) => e.field === "password" && e.code === "COMMON_PASSWORD"
        )
      ).toBe(true)
    })

    it("should return 400 for password with repeated characters", async () => {
      const userData = {
        email: "test@example.com",
        password: "ValidPass1111!",
        name: "John Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(
        data.details.some(
          (e: any) => e.field === "password" && e.code === "REPEATED_CHARS"
        )
      ).toBe(true)
    })

    it("should return 400 for invalid name (HTML tags)", async () => {
      const userData = {
        email: "test@example.com",
        password: "ValidPass123!",
        name: "<script>alert('xss')</script>",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "name")).toBe(true)
    })

    it("should return 400 for invalid name (too long)", async () => {
      const userData = {
        email: "test@example.com",
        password: "ValidPass123!",
        name: "A".repeat(101), // 101 characters
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(
        data.details.some(
          (e: any) => e.field === "name" && e.code === "TOO_LONG"
        )
      ).toBe(true)
    })

    it("should return 400 for invalid name (invalid characters)", async () => {
      const userData = {
        email: "test@example.com",
        password: "ValidPass123!",
        name: "John@#$%Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(
        data.details.some(
          (e: any) => e.field === "name" && e.code === "INVALID_CHARACTERS"
        )
      ).toBe(true)
    })

    it("should return 400 for invalid name type", async () => {
      const userData = {
        email: "test@example.com",
        password: "ValidPass123!",
        name: 123, // number instead of string
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(
        data.details.some(
          (e: any) => e.field === "name" && e.code === "INVALID_TYPE"
        )
      ).toBe(true)
    })

    it("should return 409 for existing user", async () => {
      const userData = {
        email: "existing@example.com",
        password: "ValidPass123!",
        name: "John Doe",
      }

      ;(mockPrisma.user.findUnique as any).mockResolvedValue({
        id: "existing-user-id",
        email: "existing@example.com",
        name: "Existing User",
        password: "hashed-password",
        createdAt: new Date(),
        updatedAt: new Date(),
        userLanguage: null,
        learnedLanguage: null,
        role: "USER",
      })

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe("User already exists")
    })

    it("should successfully create user with valid data", async () => {
      const userData = {
        email: "newuser@example.com",
        password: "ValidPass123!",
        name: "John Doe",
      }

      const mockUser = {
        id: "new-user-id",
        email: "newuser@example.com",
        name: "John Doe",
        password: "hashed-password",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userLanguage: null,
        learnedLanguage: null,
        role: "USER",
      }

      ;(mockPrisma.user.findUnique as any).mockResolvedValue(null)
      ;(mockPrisma.user.create as any).mockResolvedValue(mockUser)
      mockBcrypt.hash.mockResolvedValue("hashed-password" as never)

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.message).toBe("User created successfully")
      expect(data.userId).toBe("new-user-id")
      expect(data.email).toBe("newuser@example.com")
      expect(data.name).toBe("John Doe")
      expect(data.createdAt).toBeDefined()
      expect(data.password).toBeUndefined() // Password should not be in response

      expect(mockBcrypt.hash).toHaveBeenCalledWith("ValidPass123!", 12)
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: "newuser@example.com",
          password: "hashed-password",
          name: "John Doe",
        },
      })
    })

    it("should successfully create user without name", async () => {
      const userData = {
        email: "newuser@example.com",
        password: "ValidPass123!",
      }

      const mockUser = {
        id: "new-user-id",
        email: "newuser@example.com",
        name: null,
        password: "hashed-password",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userLanguage: null,
        learnedLanguage: null,
        role: "USER",
      }

      ;(mockPrisma.user.findUnique as any).mockResolvedValue(null)
      ;(mockPrisma.user.create as any).mockResolvedValue(mockUser)
      mockBcrypt.hash.mockResolvedValue("hashed-password" as never)

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.message).toBe("User created successfully")
      expect(data.userId).toBe("new-user-id")
      expect(data.email).toBe("newuser@example.com")
      expect(data.name).toBeNull()

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: "newuser@example.com",
          password: "hashed-password",
          name: null,
        },
      })
    })

    it("should handle database errors gracefully", async () => {
      const userData = {
        email: "newuser@example.com",
        password: "ValidPass123!",
        name: "John Doe",
      }

      ;(mockPrisma.user.findUnique as any).mockRejectedValue(
        new Error("Database error") as any
      )

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Internal server error")
    })

    it("should handle bcrypt errors gracefully", async () => {
      const userData = {
        email: "newuser@example.com",
        password: "ValidPass123!",
        name: "John Doe",
      }

      ;(mockPrisma.user.findUnique as any).mockResolvedValue(null)
      mockBcrypt.hash.mockRejectedValue(new Error("Bcrypt error") as never)

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Internal server error")
    })

    it("should sanitize dangerous content in email", async () => {
      const userData = {
        email: '<script>alert("xss")</script>test@example.com',
        password: "ValidPass123!",
        name: "John Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "email")).toBe(true)
    })

    it("should sanitize dangerous content in name", async () => {
      const userData = {
        email: "test@example.com",
        password: "ValidPass123!",
        name: "<div>John</div>Doe",
      }

      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(data.details.some((e: any) => e.field === "name")).toBe(true)
    })
  })
})
