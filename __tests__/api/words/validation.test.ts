import { describe, it, expect } from "vitest"
import {
  validateWordId,
  validatePaginationParams,
  sanitizeWordData,
} from "@/lib/validation"

describe("Words Validation Utils", () => {
  describe("validateWordId", () => {
    it("should accept valid word IDs", () => {
      const result = validateWordId("123")
      expect(result.success).toBe(true)
      expect(result.data).toBe(123)
    })

    it("should accept numeric word IDs", () => {
      const result = validateWordId(456)
      expect(result.success).toBe(true)
      expect(result.data).toBe(456)
    })

    it("should reject empty word IDs", () => {
      const result = validateWordId("")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("REQUIRED")
    })

    it("should reject non-numeric word IDs", () => {
      const result = validateWordId("abc")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_WORD_ID_FORMAT")
    })

    it("should reject negative word IDs", () => {
      const result = validateWordId("-1")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_WORD_ID_FORMAT")
    })

    it("should reject zero word IDs", () => {
      const result = validateWordId("0")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_WORD_ID_FORMAT")
    })

    it("should reject decimal word IDs", () => {
      const result = validateWordId("123.45")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_WORD_ID_FORMAT")
    })

    it("should reject word IDs that are too large", () => {
      const result = validateWordId("2147483648") // Max 32-bit int + 1
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("WORD_ID_TOO_LARGE")
    })

    it("should reject dangerous content in word IDs", () => {
      const result = validateWordId('<script>alert("xss")</script>123')
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_WORD_ID_FORMAT")
    })

    it("should reject non-string/non-number word IDs", () => {
      const result = validateWordId({ id: 123 })
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_TYPE")
    })
  })

  describe("validatePaginationParams", () => {
    it("should accept valid pagination parameters", () => {
      const result = validatePaginationParams("2", "10")
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        page: 2,
        limit: 10,
        offset: 10,
      })
    })

    it("should use default values for undefined parameters", () => {
      const result = validatePaginationParams(undefined, undefined)
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        page: 1,
        limit: 20,
        offset: 0,
      })
    })

    it("should accept numeric parameters", () => {
      const result = validatePaginationParams(3, 15)
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        page: 3,
        limit: 15,
        offset: 30,
      })
    })

    it("should reject negative page numbers", () => {
      const result = validatePaginationParams("-1", "10")
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "page")).toBe(true)
    })

    it("should reject zero page numbers", () => {
      const result = validatePaginationParams("0", "10")
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "page")).toBe(true)
    })

    it("should reject decimal page numbers", () => {
      const result = validatePaginationParams("2.5", "10")
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "page")).toBe(true)
    })

    it("should reject page numbers that are too large", () => {
      const result = validatePaginationParams("10001", "10")
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.code === "PAGE_TOO_LARGE")).toBe(true)
    })

    it("should reject negative limits", () => {
      const result = validatePaginationParams("1", "-5")
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "limit")).toBe(true)
    })

    it("should reject zero limits", () => {
      const result = validatePaginationParams("1", "0")
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "limit")).toBe(true)
    })

    it("should reject limits that are too large", () => {
      const result = validatePaginationParams("1", "101")
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.code === "LIMIT_TOO_LARGE")).toBe(true)
    })

    it("should reject non-numeric parameters", () => {
      const result = validatePaginationParams("abc", "def")
      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it("should handle mixed valid and invalid parameters", () => {
      const result = validatePaginationParams("2", "invalid")
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "limit")).toBe(true)
    })
  })

  describe("sanitizeWordData", () => {
    it("should sanitize word data correctly", () => {
      const word = {
        id: 123,
        wordFrom: "hello",
        wordTo: "bonjour",
        exampleFrom: "Hello world",
        exampleTo: "Bonjour le monde",
        langFrom: "en",
        langTo: "fr",
        typeCode: "nm",
        typeName: "noun",
        createdAt: new Date("2023-01-01"),
        tag: "greeting",
      }

      const result = sanitizeWordData(word)
      expect(result).toEqual({
        id: 123,
        wordFrom: "hello",
        wordTo: "bonjour",
        exampleFrom: "Hello world",
        exampleTo: "Bonjour le monde",
        langFrom: "en",
        langTo: "fr",
        typeCode: "nm",
        typeName: "noun",
        createdAt: new Date("2023-01-01"),
        tag: "greeting",
      })
    })

    it("should handle word data with null tag", () => {
      const word = {
        id: 456,
        wordFrom: "test",
        wordTo: "test",
        exampleFrom: "test example",
        exampleTo: "exemple de test",
        langFrom: "en",
        langTo: "fr",
        typeCode: "nm",
        typeName: "noun",
        createdAt: new Date("2023-01-01"),
        tag: null,
      }

      const result = sanitizeWordData(word)
      expect(result.tag).toBe(null)
    })

    it("should handle word data without tag", () => {
      const word = {
        id: 789,
        wordFrom: "test",
        wordTo: "test",
        exampleFrom: "test example",
        exampleTo: "exemple de test",
        langFrom: "en",
        langTo: "fr",
        typeCode: "nm",
        typeName: "noun",
        createdAt: new Date("2023-01-01"),
      }

      const result = sanitizeWordData(word)
      expect(result.tag).toBeUndefined()
    })
  })
})
