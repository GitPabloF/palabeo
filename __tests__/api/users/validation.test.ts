import { describe, it, expect } from "vitest"
import {
  validateEmail,
  validateUserName,
  validateUserCreationData,
  validateUserRole,
  isAdminRole,
  sanitizeString,
} from "@/lib/validation"

describe("User Validation Utils", () => {
  describe("validateEmail", () => {
    it("should accept valid email addresses", () => {
      const result = validateEmail("test@example.com")
      expect(result.success).toBe(true)
      expect(result.data).toBe("test@example.com")
    })

    it("should accept emails with special characters", () => {
      const result = validateEmail("user.name+tag@domain.co.uk")
      expect(result.success).toBe(true)
      expect(result.data).toBe("user.name+tag@domain.co.uk")
    })

    it("should convert to lowercase", () => {
      const result = validateEmail("TEST@EXAMPLE.COM")
      expect(result.success).toBe(true)
      expect(result.data).toBe("test@example.com")
    })

    it("should reject empty emails", () => {
      const result = validateEmail("")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("REQUIRED")
    })

    it("should reject invalid email formats", () => {
      const result = validateEmail("invalid-email")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_EMAIL_FORMAT")
    })

    it("should reject emails that are too long", () => {
      const longEmail = "a".repeat(250) + "@example.com"
      const result = validateEmail(longEmail)
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("TOO_LONG")
    })

    it("should sanitize dangerous content in emails", () => {
      const result = validateEmail(
        '<script>alert("xss")</script>test@example.com'
      )
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_EMAIL_FORMAT")
    })
  })

  describe("validateUserName", () => {
    it("should accept valid names", () => {
      const result = validateUserName("John Doe")
      expect(result.success).toBe(true)
      expect(result.data).toBe("John Doe")
    })

    it("should accept names with special characters", () => {
      const result = validateUserName("Jean-Pierre O'Connor")
      expect(result.success).toBe(true)
      expect(result.data).toBe("Jean-Pierre O'Connor")
    })

    it("should reject empty names", () => {
      const result = validateUserName("")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("REQUIRED")
    })

    it("should reject names with invalid characters", () => {
      const result = validateUserName("John<script>alert('xss')</script>")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_CHARACTERS")
    })

    it("should reject names that are too long", () => {
      const longName = "a".repeat(101)
      const result = validateUserName(longName)
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("TOO_LONG")
    })

    it("should sanitize dangerous content", () => {
      const result = validateUserName("<div>John</div>")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_CHARACTERS")
    })
  })

  describe("validateUserCreationData", () => {
    it("should validate complete valid user data", () => {
      const userData = {
        email: "test@example.com",
        name: "John Doe",
        userLanguage: "en",
        learnedLanguage: "es",
      }

      const result = validateUserCreationData(userData)
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        email: "test@example.com",
        name: "John Doe",
        userLanguage: "en",
        learnedLanguage: "es",
      })
    })

    it("should use default values for missing optional parameters", () => {
      const userData = {
        email: "test@example.com",
        name: "John Doe",
      }

      const result = validateUserCreationData(userData)
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        email: "test@example.com",
        name: "John Doe",
        userLanguage: "en",
        learnedLanguage: "es",
      })
    })

    it("should reject same user and learned languages", () => {
      const userData = {
        email: "test@example.com",
        name: "John Doe",
        userLanguage: "en",
        learnedLanguage: "en",
      }

      const result = validateUserCreationData(userData)
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.code === "SAME_LANGUAGES")).toBe(true)
    })

    it("should reject invalid email", () => {
      const userData = {
        email: "invalid-email",
        name: "John Doe",
      }

      const result = validateUserCreationData(userData)
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "email")).toBe(true)
    })

    it("should reject invalid name", () => {
      const userData = {
        email: "test@example.com",
        name: "",
      }

      const result = validateUserCreationData(userData)
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "name")).toBe(true)
    })

    it("should reject non-object input", () => {
      const result = validateUserCreationData("invalid")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_TYPE")
    })

    it("should reject unsupported language codes", () => {
      const userData = {
        email: "test@example.com",
        name: "John Doe",
        userLanguage: "xyz",
        learnedLanguage: "es",
      }

      const result = validateUserCreationData(userData)
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "userLanguage")).toBe(true)
    })
  })

  describe("validateUserRole", () => {
    it("should accept valid roles", () => {
      const adminResult = validateUserRole("ADMIN")
      expect(adminResult.success).toBe(true)
      expect(adminResult.data).toBe("ADMIN")

      const userResult = validateUserRole("USER")
      expect(userResult.success).toBe(true)
      expect(userResult.data).toBe("USER")
    })

    it("should handle case insensitive input", () => {
      const result = validateUserRole("admin")
      expect(result.success).toBe(true)
      expect(result.data).toBe("ADMIN")
    })

    it("should reject invalid roles", () => {
      const result = validateUserRole("INVALID")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_ROLE")
    })

    it("should reject empty roles", () => {
      const result = validateUserRole("")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("REQUIRED")
    })
  })

  describe("isAdminRole", () => {
    it("should return true for admin role", () => {
      expect(isAdminRole("ADMIN")).toBe(true)
      expect(isAdminRole("admin")).toBe(true)
    })

    it("should return false for user role", () => {
      expect(isAdminRole("USER")).toBe(false)
      expect(isAdminRole("user")).toBe(false)
    })

    it("should return false for undefined role", () => {
      expect(isAdminRole(undefined)).toBe(false)
    })

    it("should return false for invalid role", () => {
      expect(isAdminRole("INVALID")).toBe(false)
    })
  })

  describe("sanitizeString", () => {
    it("should remove HTML tags from user input", () => {
      expect(sanitizeString('<script>alert("xss")</script>hello')).toBe("hello")
      expect(sanitizeString("<div>test</div>")).toBe("test")
    })

    it("should remove dangerous characters", () => {
      expect(sanitizeString('test<>"&')).toBe("test")
    })

    it("should handle email sanitization", () => {
      expect(sanitizeString("test@example.com")).toBe("test@example.com")
      expect(sanitizeString("test<script>@example.com")).toBe(
        "test@example.com"
      )
    })

    it("should handle name sanitization", () => {
      expect(sanitizeString("John Doe")).toBe("John Doe")
      expect(sanitizeString("John<script>Doe")).toBe("JohnDoe")
    })
  })
})
