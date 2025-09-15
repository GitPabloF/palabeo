/**
 * Validation and sanitization utilities for API routes
 * Provides secure input validation and sanitization functions
 */

// Supported language codes for translation
export const SUPPORTED_LANGUAGES = ["es", "fr", "en"] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Validation error types
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors: ValidationError[]
}

/**
 * Sanitize a string by removing potentially dangerous characters
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") {
    return ""
  }

  return (
    input
      .trim()
      // Remove script tags and their content first (more specific)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove all HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove potentially dangerous characters
      .replace(/[<>'"&]/g, "")
      // Remove control characters except newlines and tabs
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      // Limit length to prevent DoS
      .substring(0, 1000)
  )
}

/**
 * Validate and sanitize a word parameter
 * @param word - The word to validate
 * @returns Validation result
 */
export function validateWord(word: unknown): ValidationResult<string> {
  const errors: ValidationError[] = []

  if (!word) {
    errors.push({
      field: "word",
      message: "Word parameter is required",
      code: "REQUIRED",
    })
    return { success: false, errors }
  }

  if (typeof word !== "string") {
    errors.push({
      field: "word",
      message: "Word parameter must be a string",
      code: "INVALID_TYPE",
    })
    return { success: false, errors }
  }

  // Check for valid word characters in the original input first
  if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(word)) {
    errors.push({
      field: "word",
      message: "Word contains invalid characters",
      code: "INVALID_CHARACTERS",
    })
    return { success: false, errors }
  }

  const sanitized = sanitizeString(word)

  if (sanitized.length === 0) {
    errors.push({
      field: "word",
      message: "Word parameter cannot be empty after sanitization",
      code: "EMPTY_AFTER_SANITIZATION",
    })
    return { success: false, errors }
  }

  // Check for minimum length
  if (sanitized.length < 1) {
    errors.push({
      field: "word",
      message: "Word must be at least 1 character long",
      code: "TOO_SHORT",
    })
    return { success: false, errors }
  }

  // Check for maximum length
  if (sanitized.length > 100) {
    errors.push({
      field: "word",
      message: "Word must be no more than 100 characters long",
      code: "TOO_LONG",
    })
    return { success: false, errors }
  }

  return { success: true, data: sanitized, errors: [] }
}

/**
 * Validate and sanitize a language code
 * @param lang - The language code to validate
 * @param fieldName - The field name for error reporting
 * @returns Validation result
 */
export function validateLanguageCode(
  lang: unknown,
  fieldName: string = "language"
): ValidationResult<SupportedLanguage> {
  const errors: ValidationError[] = []

  if (!lang) {
    errors.push({
      field: fieldName,
      message: `${fieldName} parameter is required`,
      code: "REQUIRED",
    })
    return { success: false, errors }
  }

  if (typeof lang !== "string") {
    errors.push({
      field: fieldName,
      message: `${fieldName} parameter must be a string`,
      code: "INVALID_TYPE",
    })
    return { success: false, errors }
  }

  const sanitized = sanitizeString(lang).toLowerCase()

  if (!SUPPORTED_LANGUAGES.includes(sanitized as SupportedLanguage)) {
    errors.push({
      field: fieldName,
      message: `Unsupported language code. Supported codes: ${SUPPORTED_LANGUAGES.join(
        ", "
      )}`,
      code: "UNSUPPORTED_LANGUAGE",
    })
    return { success: false, errors }
  }

  return { success: true, data: sanitized as SupportedLanguage, errors: [] }
}

/**
 * Validate and sanitize a boolean parameter
 * @param value - The value to validate
 * @param fieldName - The field name for error reporting
 * @returns Validation result
 */
export function validateBoolean(
  value: unknown,
  fieldName: string = "boolean"
): ValidationResult<boolean> {
  const errors: ValidationError[] = []

  if (value === undefined || value === null) {
    return { success: true, data: false, errors: [] }
  }

  if (typeof value === "boolean") {
    return { success: true, data: value, errors: [] }
  }

  if (typeof value === "string") {
    const sanitized = sanitizeString(value).toLowerCase()
    if (sanitized === "true") {
      return { success: true, data: true, errors: [] }
    }
    if (sanitized === "false") {
      return { success: true, data: false, errors: [] }
    }
  }

  errors.push({
    field: fieldName,
    message: `${fieldName} parameter must be a boolean or 'true'/'false' string`,
    code: "INVALID_TYPE",
  })

  return { success: false, errors }
}

/**
 * Validate translate API parameters
 * @param searchParams - URL search parameters
 * @returns Validation result with sanitized data
 */
export function validateTranslateParams(
  searchParams: URLSearchParams
): ValidationResult<{
  word: string
  from: SupportedLanguage
  to: SupportedLanguage
  isReversedLang: boolean
}> {
  const errors: ValidationError[] = []

  // Validate word parameter
  const wordResult = validateWord(searchParams.get("word"))
  if (!wordResult.success) {
    errors.push(...wordResult.errors)
  }

  // Validate from language (default to 'es')
  const fromParam = searchParams.get("from") || "es"
  const fromResult = validateLanguageCode(fromParam, "from")
  if (!fromResult.success) {
    errors.push(...fromResult.errors)
  }

  // Validate to language (default to 'fr')
  const toParam = searchParams.get("to") || "fr"
  const toResult = validateLanguageCode(toParam, "to")
  if (!toResult.success) {
    errors.push(...toResult.errors)
  }

  // Validate isReversedLang parameter
  const isReversedLangResult = validateBoolean(
    searchParams.get("isReversedLang"),
    "isReversedLang"
  )
  if (!isReversedLangResult.success) {
    errors.push(...isReversedLangResult.errors)
  }

  // Check if from and to are different
  if (
    fromResult.success &&
    toResult.success &&
    fromResult.data === toResult.data
  ) {
    errors.push({
      field: "from/to",
      message: "Source and target languages must be different",
      code: "SAME_LANGUAGES",
    })
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  return {
    success: true,
    data: {
      word: wordResult.data!,
      from: fromResult.data!,
      to: toResult.data!,
      isReversedLang: isReversedLangResult.data!,
    },
    errors: [],
  }
}

/**
 * Create a standardized error response for validation failures
 * @param errors - Array of validation errors
 * @param statusCode - HTTP status code (default: 400)
 * @returns NextResponse with error details
 */
export function createValidationErrorResponse(
  errors: ValidationError[],
  statusCode: number = 400
) {
  return {
    error: "Validation failed",
    details: errors,
    message: errors.map((e) => `${e.field}: ${e.message}`).join(", "),
  }
}
