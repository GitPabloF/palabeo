import { describe, it, expect } from "vitest"
import { validateUserId, validateUserUpdateData } from "@/lib/validation"

describe("User ID Validation Utils", () => {
  describe("validateUserId", () => {
    it("should accept valid CUID", () => {
      const validCuid = "cmdopvcgj0000v1ckd5h4x3e9"
      const result = validateUserId(validCuid)
      expect(result.success).toBe(true)
      expect(result.data).toBe(validCuid)
    })

    it("should accept valid CUID with uppercase", () => {
      const validCuid = "CMdOpVcgJ0000V1CkD5H4X3E9"
      const result = validateUserId(validCuid)
      expect(result.success).toBe(true)
      expect(result.data).toBe(validCuid.toLowerCase())
    })

    it("should reject invalid CUID format", () => {
      const invalidCuid = "not-a-cuid"
      const result = validateUserId(invalidCuid)
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_CUID_FORMAT")
    })

    it("should reject CUID that doesn't start with 'c'", () => {
      const invalidCuid = "dmdopvcgj0000v1ckd5h4x3e9"
      const result = validateUserId(invalidCuid)
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_CUID_FORMAT")
    })

    it("should reject CUID with wrong length", () => {
      const invalidCuid = "cmdopvcgj0000v1ckd5h4x3e" // too short
      const result = validateUserId(invalidCuid)
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_CUID_FORMAT")
    })

    it("should reject empty userId", () => {
      const result = validateUserId("")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("REQUIRED")
    })

    it("should reject non-string userId", () => {
      const result = validateUserId(123)
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_TYPE")
    })

    it("should sanitize dangerous content in userId", () => {
      const result = validateUserId(
        '<script>alert("xss")</script>cmdopvcgj0000v1ckd5h4x3e9'
      )
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_CUID_FORMAT")
    })
  })

  describe("validateUserUpdateData", () => {
    it("should validate complete valid update data", () => {
      const updateData = {
        name: "John Doe",
        email: "john@example.com",
        userLanguage: "en",
        learnedLanguage: "es",
      }

      const result = validateUserUpdateData(updateData)
      expect(result.success).toBe(true)
      expect(result.data).toEqual(updateData)
    })

    it("should validate partial update data", () => {
      const updateData = {
        name: "Jane Doe",
      }

      const result = validateUserUpdateData(updateData)
      expect(result.success).toBe(true)
      expect(result.data).toEqual(updateData)
    })

    it("should validate empty object", () => {
      const result = validateUserUpdateData({})
      expect(result.success).toBe(true)
      expect(result.data).toEqual({})
    })

    it("should reject same user and learned languages", () => {
      const updateData = {
        userLanguage: "en",
        learnedLanguage: "en",
      }

      const result = validateUserUpdateData(updateData)
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.code === "SAME_LANGUAGES")).toBe(true)
    })

    it("should reject invalid email format", () => {
      const updateData = {
        email: "invalid-email",
      }

      const result = validateUserUpdateData(updateData)
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "email")).toBe(true)
    })

    it("should reject invalid name", () => {
      const updateData = {
        name: '<script>alert("xss")</script>',
      }

      const result = validateUserUpdateData(updateData)
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "name")).toBe(true)
    })

    it("should reject unsupported language codes", () => {
      const updateData = {
        userLanguage: "xyz",
      }

      const result = validateUserUpdateData(updateData)
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "userLanguage")).toBe(true)
    })

    it("should reject non-object input", () => {
      const result = validateUserUpdateData("invalid")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_TYPE")
    })

    it("should handle mixed valid and invalid data", () => {
      const updateData = {
        name: "Valid Name",
        email: "invalid-email",
        userLanguage: "en",
      }

      const result = validateUserUpdateData(updateData)
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "email")).toBe(true)
      expect(result.errors.some((e) => e.field === "name")).toBe(false)
    })

    it("should sanitize valid data", () => {
      const updateData = {
        name: "  John Doe  ", // Should be trimmed
        email: "  JOHN@EXAMPLE.COM  ", // Should be trimmed and lowercased
      }

      const result = validateUserUpdateData(updateData)
      expect(result.success).toBe(true)
      expect(result.data?.name).toBe("John Doe")
      expect(result.data?.email).toBe("john@example.com")
    })
  })
})
