import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { GET } from "@/app/api/translate/route"

// Mock complet du module rate-limit
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(),
}))

// Mock du module formatWord
vi.mock("@/utils/formatWord", () => ({
  formatTypeName: vi.fn((type) => type || "unknown"),
  formatTypeCode: vi.fn((type) => type || "unknown"),
  formatWord: vi.fn((word) => word),
  formatExemple: vi.fn((example) => example),
}))

// Mock de fetch global
const mockFetch = vi.fn()
global.fetch = mockFetch

describe("API Route /api/translate - Rate Limiting Tests", () => {
  let mockCheckRateLimit: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()
    // Set default environment variable
    process.env.WORDREFERENCE_PROXY_URL = "https://mock-proxy.com"

    const { checkRateLimit } = await import("@/lib/rate-limit")
    mockCheckRateLimit = vi.mocked(checkRateLimit)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe("Rate Limiting", () => {
    it("should block the request when the rate limit is exceeded", async () => {
      // Arrange
      mockCheckRateLimit.mockResolvedValue(false)

      const request = new NextRequest(
        "http://localhost:3000/api/translate?word=hola",
        {
          method: "GET",
          headers: {
            "x-forwarded-for": "192.168.1.1",
          },
        }
      )

      // Act
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(429)
      expect(data.error).toBe("Rate limit exceeded. Please try again later.")
      expect(mockCheckRateLimit).toHaveBeenCalledWith("192.168.1.1")
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it("should allow the request when the rate limit is respected", async () => {
      // Arrange
      mockCheckRateLimit.mockResolvedValue(true)
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            translations: [
              {
                translations: [
                  {
                    from: "hola",
                    to: "bonjour",
                    fromType: "interj",
                    toType: "interj",
                    example: {
                      from: ["¡Hola!"],
                      to: ["Bonjour !"],
                    },
                  },
                ],
              },
            ],
          }),
      })

      const request = new NextRequest(
        "http://localhost:3000/api/translate?word=hola",
        {
          method: "GET",
          headers: {
            "x-forwarded-for": "192.168.1.1",
          },
        }
      )

      // Act
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.message).toBe("sucess")
      expect(mockCheckRateLimit).toHaveBeenCalledWith("192.168.1.1")
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe("Extraction d'adresse IP", () => {
    it("should extract the IP from x-forwarded-for (first IP)", async () => {
      // Arrange
      mockCheckRateLimit.mockResolvedValue(false)

      const request = new NextRequest(
        "http://localhost:3000/api/translate?word=hola",
        {
          method: "GET",
          headers: {
            "x-forwarded-for": "203.0.113.1, 198.51.100.1, 192.168.1.1",
          },
        }
      )

      // Act
      await GET(request)

      // Assert
      expect(mockCheckRateLimit).toHaveBeenCalledWith("203.0.113.1")
    })

    it("should extract the IP from x-real-ip if x-forwarded-for does not exist", async () => {
      // Arrange
      mockCheckRateLimit.mockResolvedValue(false)

      const request = new NextRequest(
        "http://localhost:3000/api/translate?word=hola",
        {
          method: "GET",
          headers: {
            "x-real-ip": "203.0.113.2",
          },
        }
      )

      // Act
      await GET(request)

      // Assert
      expect(mockCheckRateLimit).toHaveBeenCalledWith("203.0.113.2")
    })

    it("should use 127.0.0.1 by default if no IP is found", async () => {
      // Arrange
      mockCheckRateLimit.mockResolvedValue(false)

      const request = new NextRequest(
        "http://localhost:3000/api/translate?word=hola",
        {
          method: "GET",
          headers: {},
        }
      )

      // Act
      await GET(request)

      // Assert
      expect(mockCheckRateLimit).toHaveBeenCalledWith("127.0.0.1")
    })
  })

  describe("Validation of parameters with rate limiting", () => {
    it("should verify the rate limit before validating the parameters", async () => {
      // Arrange
      mockCheckRateLimit.mockResolvedValue(false)

      // Requête sans paramètre word
      const request = new NextRequest("http://localhost:3000/api/translate", {
        method: "GET",
        headers: {
          "x-forwarded-for": "192.168.1.1",
        },
      })

      // Act
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(429)
      expect(data.error).toBe("Rate limit exceeded. Please try again later.")
      expect(mockCheckRateLimit).toHaveBeenCalledWith("192.168.1.1")
    })

    it("should validate the parameters after passing the rate limit", async () => {
      // Arrange
      mockCheckRateLimit.mockResolvedValue(true)

      // Requête sans paramètre word
      const request = new NextRequest("http://localhost:3000/api/translate", {
        method: "GET",
        headers: {
          "x-forwarded-for": "192.168.1.1",
        },
      })

      // Act
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
      expect(data.details).toBeDefined()
      expect(mockCheckRateLimit).toHaveBeenCalledWith("192.168.1.1")
    })
  })

  describe("Error handling with rate limiting", () => {
    it("should handle the errors of the rate limiting service", async () => {
      // Arrange
      mockCheckRateLimit.mockRejectedValue(new Error("Redis connection failed"))

      const request = new NextRequest(
        "http://localhost:3000/api/translate?word=hola",
        {
          method: "GET",
          headers: {
            "x-forwarded-for": "192.168.1.1",
          },
        }
      )

      // Act & Assert
      await expect(GET(request)).rejects.toThrow("Redis connection failed")
    })
  })

  describe("Integration scenarios", () => {
    it("should handle a complete request with rate limiting enabled", async () => {
      // Arrange
      mockCheckRateLimit.mockResolvedValue(true)
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            translations: [
              {
                translations: [
                  {
                    from: "casa",
                    to: "maison",
                    fromType: "nf",
                    toType: "nf",
                    example: {
                      from: ["Mi casa es tu casa."],
                      to: ["Ma maison est ta maison."],
                    },
                  },
                ],
              },
            ],
          }),
      })

      const request = new NextRequest(
        "http://localhost:3000/api/translate?word=casa&from=es&to=fr",
        {
          method: "GET",
          headers: {
            "x-forwarded-for": "192.168.1.100",
          },
        }
      )

      // Act
      const response = await GET(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.message).toBe("sucess")
      expect(data.data).toBeDefined()
      expect(data.data.langFrom).toBe("es")
      expect(data.data.langTo).toBe("fr")
      expect(mockCheckRateLimit).toHaveBeenCalledWith("192.168.1.100")
    })

    it("should block multiple requests from the same IP after exceeding the rate limit", async () => {
      // Arrange
      const ip = "192.168.1.200"

      // Première requête autorisée
      mockCheckRateLimit.mockResolvedValueOnce(true)
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            translations: [
              {
                translations: [
                  {
                    from: "test",
                    to: "test",
                    fromType: "nm",
                    toType: "nm",
                    example: { from: ["test"], to: ["test"] },
                  },
                ],
              },
            ],
          }),
      })

      const firstRequest = new NextRequest(
        "http://localhost:3000/api/translate?word=hello&from=es&to=fr",
        {
          method: "GET",
          headers: { "x-forwarded-for": ip },
        }
      )

      // Deuxième requête bloquée
      mockCheckRateLimit.mockResolvedValueOnce(false)

      const secondRequest = new NextRequest(
        "http://localhost:3000/api/translate?word=world&from=es&to=fr",
        {
          method: "GET",
          headers: { "x-forwarded-for": ip },
        }
      )

      // Act
      const firstResponse = await GET(firstRequest)
      const secondResponse = await GET(secondRequest)

      // Assert
      expect(firstResponse.status).toBe(200)
      expect(secondResponse.status).toBe(429)
      expect(mockCheckRateLimit).toHaveBeenCalledTimes(2)
      expect(mockCheckRateLimit).toHaveBeenNthCalledWith(1, ip)
      expect(mockCheckRateLimit).toHaveBeenNthCalledWith(2, ip)
    })
  })
})
