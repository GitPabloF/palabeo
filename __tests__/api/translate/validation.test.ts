import { describe, it, expect } from "vitest"
import {
  validateWord,
  validateLanguageCode,
  validateBoolean,
  validateTranslateParams,
  sanitizeString,
} from "@/lib/validation"

describe("Validation Utils", () => {
  describe("sanitizeString", () => {
    it("should remove HTML tags", () => {
      expect(sanitizeString('<script>alert("xss")</script>hello')).toBe("hello")
      expect(sanitizeString("<div>test</div>")).toBe("test")
    })

    it("should remove dangerous characters", () => {
      expect(sanitizeString('test<>"&')).toBe("test")
    })

    it("should limit length", () => {
      const longString = "a".repeat(2000)
      expect(sanitizeString(longString).length).toBe(1000)
    })

    it("should handle empty strings", () => {
      expect(sanitizeString("")).toBe("")
      expect(sanitizeString("   ")).toBe("")
    })
  })

  describe("validateWord", () => {
    it("should accept valid words", () => {
      const result = validateWord("hello")
      expect(result.success).toBe(true)
      expect(result.data).toBe("hello")
    })

    it("should reject empty words", () => {
      const result = validateWord("")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("REQUIRED")
    })

    it("should reject non-string inputs", () => {
      const result = validateWord(123)
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_TYPE")
    })

    it("should reject words with invalid characters", () => {
      const result = validateWord("hello<script>")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_CHARACTERS")
    })

    it("should reject words that are too long", () => {
      const longWord = "a".repeat(101)
      const result = validateWord(longWord)
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("TOO_LONG")
    })

    it("should accept words with spaces and hyphens", () => {
      const result = validateWord("hello-world test")
      expect(result.success).toBe(true)
      expect(result.data).toBe("hello-world test")
    })
  })

  describe("validateLanguageCode", () => {
    it("should accept valid language codes", () => {
      const result = validateLanguageCode("es", "from")
      expect(result.success).toBe(true)
      expect(result.data).toBe("es")
    })

    it("should reject unsupported language codes", () => {
      const result = validateLanguageCode("xyz", "from")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("UNSUPPORTED_LANGUAGE")
    })

    it("should handle case insensitive input", () => {
      const result = validateLanguageCode("ES", "from")
      expect(result.success).toBe(true)
      expect(result.data).toBe("es")
    })

    it("should reject empty language codes", () => {
      const result = validateLanguageCode("", "from")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("REQUIRED")
    })
  })

  describe("validateBoolean", () => {
    it("should accept boolean true", () => {
      const result = validateBoolean(true)
      expect(result.success).toBe(true)
      expect(result.data).toBe(true)
    })

    it('should accept string "true"', () => {
      const result = validateBoolean("true")
      expect(result.success).toBe(true)
      expect(result.data).toBe(true)
    })

    it('should accept string "false"', () => {
      const result = validateBoolean("false")
      expect(result.success).toBe(true)
      expect(result.data).toBe(false)
    })

    it("should default to false for undefined", () => {
      const result = validateBoolean(undefined)
      expect(result.success).toBe(true)
      expect(result.data).toBe(false)
    })

    it("should reject invalid boolean strings", () => {
      const result = validateBoolean("maybe")
      expect(result.success).toBe(false)
      expect(result.errors[0].code).toBe("INVALID_TYPE")
    })
  })

  describe("validateTranslateParams", () => {
    it("should validate complete valid parameters", () => {
      const params = new URLSearchParams({
        word: "hello",
        from: "en",
        to: "fr",
        isReversedLang: "false",
      })

      const result = validateTranslateParams(params)
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        word: "hello",
        from: "en",
        to: "fr",
        isReversedLang: false,
      })
    })

    it("should use default values for missing optional parameters", () => {
      const params = new URLSearchParams({
        word: "hello",
      })

      const result = validateTranslateParams(params)
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        word: "hello",
        from: "es",
        to: "fr",
        isReversedLang: false,
      })
    })

    it("should reject same source and target languages", () => {
      const params = new URLSearchParams({
        word: "hello",
        from: "en",
        to: "en",
      })

      const result = validateTranslateParams(params)
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.code === "SAME_LANGUAGES")).toBe(true)
    })

    it("should reject invalid word parameter", () => {
      const params = new URLSearchParams({
        word: '<script>alert("xss")</script>',
        from: "en",
        to: "fr",
      })

      const result = validateTranslateParams(params)
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "word")).toBe(true)
    })

    it("should reject unsupported language codes", () => {
      const params = new URLSearchParams({
        word: "hello",
        from: "xyz",
        to: "fr",
      })

      const result = validateTranslateParams(params)
      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.field === "from")).toBe(true)
    })
  })
})
