/**
 * Validation and sanitization utilities for API routes
 * Provides secure input validation and sanitization functions
 */

// Supported language codes for translation
export const SUPPORTED_LANGUAGES = ["es", "fr", "en"] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// User roles
export const USER_ROLES = ["USER", "ADMIN"] as const

export type UserRole = (typeof USER_ROLES)[number]

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
      // Remove potentially dangerous characters (but keep apostrophes for names)
      .replace(/[<>"&]/g, "")
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
 * Validate and sanitize an email address
 * @param email - The email to validate
 * @returns Validation result
 */
export function validateEmail(email: unknown): ValidationResult<string> {
  const errors: ValidationError[] = []

  if (!email) {
    errors.push({
      field: "email",
      message: "Email parameter is required",
      code: "REQUIRED",
    })
    return { success: false, errors }
  }

  if (typeof email !== "string") {
    errors.push({
      field: "email",
      message: "Email parameter must be a string",
      code: "INVALID_TYPE",
    })
    return { success: false, errors }
  }

  // Check for dangerous content in original email first
  if (/<[^>]*>/.test(email)) {
    errors.push({
      field: "email",
      message: "Email contains invalid characters",
      code: "INVALID_EMAIL_FORMAT",
    })
    return { success: false, errors }
  }

  const sanitized = sanitizeString(email).toLowerCase()

  if (sanitized.length === 0) {
    errors.push({
      field: "email",
      message: "Email parameter cannot be empty after sanitization",
      code: "EMPTY_AFTER_SANITIZATION",
    })
    return { success: false, errors }
  }

  // Basic email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(sanitized)) {
    errors.push({
      field: "email",
      message: "Invalid email format",
      code: "INVALID_EMAIL_FORMAT",
    })
    return { success: false, errors }
  }

  // Check email length
  if (sanitized.length > 254) {
    errors.push({
      field: "email",
      message: "Email must be no more than 254 characters long",
      code: "TOO_LONG",
    })
    return { success: false, errors }
  }

  return { success: true, data: sanitized, errors: [] }
}

/**
 * Validate and sanitize a user name
 * @param name - The name to validate
 * @returns Validation result
 */
export function validateUserName(name: unknown): ValidationResult<string> {
  const errors: ValidationError[] = []

  if (!name) {
    errors.push({
      field: "name",
      message: "Name parameter is required",
      code: "REQUIRED",
    })
    return { success: false, errors }
  }

  if (typeof name !== "string") {
    errors.push({
      field: "name",
      message: "Name parameter must be a string",
      code: "INVALID_TYPE",
    })
    return { success: false, errors }
  }

  // Check for dangerous content in original name first
  if (/<[^>]*>/.test(name)) {
    errors.push({
      field: "name",
      message: "Name contains invalid characters",
      code: "INVALID_CHARACTERS",
    })
    return { success: false, errors }
  }

  const sanitized = sanitizeString(name)

  if (sanitized.length === 0) {
    errors.push({
      field: "name",
      message: "Name parameter cannot be empty after sanitization",
      code: "EMPTY_AFTER_SANITIZATION",
    })
    return { success: false, errors }
  }

  // Check for minimum length
  if (sanitized.length < 1) {
    errors.push({
      field: "name",
      message: "Name must be at least 1 character long",
      code: "TOO_SHORT",
    })
    return { success: false, errors }
  }

  // Check for maximum length
  if (sanitized.length > 100) {
    errors.push({
      field: "name",
      message: "Name must be no more than 100 characters long",
      code: "TOO_LONG",
    })
    return { success: false, errors }
  }

  // Check for valid name characters (letters, spaces, hyphens, apostrophes, dots)
  // This check is done on the sanitized string to ensure security
  if (!/^[a-zA-ZÀ-ÿ\s\-'.]+$/.test(sanitized)) {
    errors.push({
      field: "name",
      message: "Name contains invalid characters",
      code: "INVALID_CHARACTERS",
    })
    return { success: false, errors }
  }

  return { success: true, data: sanitized, errors: [] }
}

/**
 * Validate user creation data
 * @param data - The user data to validate
 * @returns Validation result with sanitized data
 */
export function validateUserCreationData(data: unknown): ValidationResult<{
  email: string
  name: string
  userLanguage: SupportedLanguage
  learnedLanguage: SupportedLanguage
}> {
  const errors: ValidationError[] = []

  if (!data || typeof data !== "object") {
    errors.push({
      field: "body",
      message: "Request body must be a valid JSON object",
      code: "INVALID_TYPE",
    })
    return { success: false, errors }
  }

  const body = data as Record<string, unknown>

  // Validate email
  const emailResult = validateEmail(body.email)
  if (!emailResult.success) {
    errors.push(...emailResult.errors)
  }

  // Validate name
  const nameResult = validateUserName(body.name)
  if (!nameResult.success) {
    errors.push(...nameResult.errors)
  }

  // Validate userLanguage (default to 'en')
  const userLanguageParam = body.userLanguage || "en"
  const userLanguageResult = validateLanguageCode(
    userLanguageParam,
    "userLanguage"
  )
  if (!userLanguageResult.success) {
    errors.push(...userLanguageResult.errors)
  }

  // Validate learnedLanguage (default to 'es')
  const learnedLanguageParam = body.learnedLanguage || "es"
  const learnedLanguageResult = validateLanguageCode(
    learnedLanguageParam,
    "learnedLanguage"
  )
  if (!learnedLanguageResult.success) {
    errors.push(...learnedLanguageResult.errors)
  }

  // Check if userLanguage and learnedLanguage are different
  if (
    userLanguageResult.success &&
    learnedLanguageResult.success &&
    userLanguageResult.data === learnedLanguageResult.data
  ) {
    errors.push({
      field: "userLanguage/learnedLanguage",
      message: "User language and learned language must be different",
      code: "SAME_LANGUAGES",
    })
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  return {
    success: true,
    data: {
      email: emailResult.data!,
      name: nameResult.data!,
      userLanguage: userLanguageResult.data!,
      learnedLanguage: learnedLanguageResult.data!,
    },
    errors: [],
  }
}

/**
 * Validate user role
 * @param role - The role to validate
 * @returns Validation result
 */
export function validateUserRole(role: unknown): ValidationResult<UserRole> {
  const errors: ValidationError[] = []

  if (!role) {
    errors.push({
      field: "role",
      message: "Role parameter is required",
      code: "REQUIRED",
    })
    return { success: false, errors }
  }

  if (typeof role !== "string") {
    errors.push({
      field: "role",
      message: "Role parameter must be a string",
      code: "INVALID_TYPE",
    })
    return { success: false, errors }
  }

  const sanitized = sanitizeString(role).toUpperCase()

  if (!USER_ROLES.includes(sanitized as UserRole)) {
    errors.push({
      field: "role",
      message: `Invalid role. Supported roles: ${USER_ROLES.join(", ")}`,
      code: "INVALID_ROLE",
    })
    return { success: false, errors }
  }

  return { success: true, data: sanitized as UserRole, errors: [] }
}

/**
 * Check if user has admin role
 * @param userRole - The user role to check
 * @returns boolean indicating if user is admin
 */
export function isAdminRole(userRole: string | undefined): boolean {
  if (!userRole) return false
  const roleResult = validateUserRole(userRole)
  return roleResult.success && roleResult.data === "ADMIN"
}

/**
 * Validate and sanitize a user ID (CUID format)
 * @param userId - The user ID to validate
 * @returns Validation result
 */
export function validateUserId(userId: unknown): ValidationResult<string> {
  const errors: ValidationError[] = []

  if (!userId) {
    errors.push({
      field: "userId",
      message: "User ID parameter is required",
      code: "REQUIRED",
    })
    return { success: false, errors }
  }

  if (typeof userId !== "string") {
    errors.push({
      field: "userId",
      message: "User ID parameter must be a string",
      code: "INVALID_TYPE",
    })
    return { success: false, errors }
  }

  // Check for dangerous content in original userId first
  if (/<[^>]*>/.test(userId)) {
    errors.push({
      field: "userId",
      message: "User ID contains invalid characters",
      code: "INVALID_CUID_FORMAT",
    })
    return { success: false, errors }
  }

  const sanitized = sanitizeString(userId).toLowerCase()

  if (sanitized.length === 0) {
    errors.push({
      field: "userId",
      message: "User ID parameter cannot be empty after sanitization",
      code: "EMPTY_AFTER_SANITIZATION",
    })
    return { success: false, errors }
  }

  // CUID validation regex
  // CUIDs start with 'c' followed by 24 characters (lowercase letters and numbers)
  const cuidRegex = /^c[a-z0-9]{24}$/
  if (!cuidRegex.test(sanitized)) {
    errors.push({
      field: "userId",
      message: "User ID must be a valid CUID format",
      code: "INVALID_CUID_FORMAT",
    })
    return { success: false, errors }
  }

  return { success: true, data: sanitized, errors: [] }
}

/**
 * Validate user update data (all fields optional)
 * @param data - The user update data to validate
 * @returns Validation result with sanitized data
 */
export function validateUserUpdateData(data: unknown): ValidationResult<{
  name?: string
  email?: string
  userLanguage?: SupportedLanguage
  learnedLanguage?: SupportedLanguage
}> {
  const errors: ValidationError[] = []

  if (!data || typeof data !== "object") {
    errors.push({
      field: "body",
      message: "Request body must be a valid JSON object",
      code: "INVALID_TYPE",
    })
    return { success: false, errors }
  }

  const body = data as Record<string, unknown>
  const result: {
    name?: string
    email?: string
    userLanguage?: SupportedLanguage
    learnedLanguage?: SupportedLanguage
  } = {}

  // Validate name if provided
  if (body.name !== undefined) {
    const nameResult = validateUserName(body.name)
    if (!nameResult.success) {
      errors.push(...nameResult.errors)
    } else {
      result.name = nameResult.data
    }
  }

  // Validate email if provided
  if (body.email !== undefined) {
    const emailResult = validateEmail(body.email)
    if (!emailResult.success) {
      errors.push(...emailResult.errors)
    } else {
      result.email = emailResult.data
    }
  }

  // Validate userLanguage if provided
  if (body.userLanguage !== undefined) {
    const userLanguageResult = validateLanguageCode(
      body.userLanguage,
      "userLanguage"
    )
    if (!userLanguageResult.success) {
      errors.push(...userLanguageResult.errors)
    } else {
      result.userLanguage = userLanguageResult.data
    }
  }

  // Validate learnedLanguage if provided
  if (body.learnedLanguage !== undefined) {
    const learnedLanguageResult = validateLanguageCode(
      body.learnedLanguage,
      "learnedLanguage"
    )
    if (!learnedLanguageResult.success) {
      errors.push(...learnedLanguageResult.errors)
    } else {
      result.learnedLanguage = learnedLanguageResult.data
    }
  }

  // Check if userLanguage and learnedLanguage are different (if both provided)
  if (
    result.userLanguage &&
    result.learnedLanguage &&
    result.userLanguage === result.learnedLanguage
  ) {
    errors.push({
      field: "userLanguage/learnedLanguage",
      message: "User language and learned language must be different",
      code: "SAME_LANGUAGES",
    })
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  return {
    success: true,
    data: result,
    errors: [],
  }
}

/**
 * Validate and sanitize a word ID (integer)
 * @param wordId - The word ID to validate
 * @returns Validation result
 */
export function validateWordId(wordId: unknown): ValidationResult<number> {
  const errors: ValidationError[] = []

  if (!wordId) {
    errors.push({
      field: "wordId",
      message: "Word ID parameter is required",
      code: "REQUIRED",
    })
    return { success: false, errors }
  }

  if (typeof wordId !== "string" && typeof wordId !== "number") {
    errors.push({
      field: "wordId",
      message: "Word ID parameter must be a string or number",
      code: "INVALID_TYPE",
    })
    return { success: false, errors }
  }

  const sanitized = sanitizeString(String(wordId))

  if (sanitized.length === 0) {
    errors.push({
      field: "wordId",
      message: "Word ID parameter cannot be empty after sanitization",
      code: "EMPTY_AFTER_SANITIZATION",
    })
    return { success: false, errors }
  }

  // Check for dangerous content in original wordId first
  if (typeof wordId === "string" && /<[^>]*>/.test(wordId)) {
    errors.push({
      field: "wordId",
      message: "Word ID contains invalid characters",
      code: "INVALID_WORD_ID_FORMAT",
    })
    return { success: false, errors }
  }

  // Validate that it's a positive integer
  const parsedId = parseInt(sanitized, 10)
  if (
    isNaN(parsedId) ||
    parsedId <= 0 ||
    !Number.isInteger(parsedId) ||
    parsedId.toString() !== sanitized
  ) {
    errors.push({
      field: "wordId",
      message: "Word ID must be a positive integer",
      code: "INVALID_WORD_ID_FORMAT",
    })
    return { success: false, errors }
  }

  // Check for reasonable range (prevent DoS with extremely large numbers)
  if (parsedId > 2147483647) {
    // Max 32-bit signed integer
    errors.push({
      field: "wordId",
      message: "Word ID is too large",
      code: "WORD_ID_TOO_LARGE",
    })
    return { success: false, errors }
  }

  return { success: true, data: parsedId, errors: [] }
}

/**
 * Validate pagination parameters
 * @param page - The page number
 * @param limit - The limit per page
 * @returns Validation result with sanitized pagination data
 */
export function validatePaginationParams(
  page: unknown,
  limit: unknown
): ValidationResult<{ page: number; limit: number; offset: number }> {
  const errors: ValidationError[] = []

  // Validate page parameter
  let validatedPage = 1
  if (page !== undefined) {
    if (typeof page !== "string" && typeof page !== "number") {
      errors.push({
        field: "page",
        message: "Page parameter must be a string or number",
        code: "INVALID_TYPE",
      })
    } else {
      const sanitizedPage = sanitizeString(String(page))
      const parsedPage = parseInt(sanitizedPage, 10)

      if (
        isNaN(parsedPage) ||
        parsedPage < 1 ||
        !Number.isInteger(parsedPage) ||
        parsedPage.toString() !== sanitizedPage
      ) {
        errors.push({
          field: "page",
          message: "Page must be a positive integer",
          code: "INVALID_PAGE_FORMAT",
        })
      } else if (parsedPage > 10000) {
        // Reasonable limit
        errors.push({
          field: "page",
          message: "Page number is too large",
          code: "PAGE_TOO_LARGE",
        })
      } else {
        validatedPage = parsedPage
      }
    }
  }

  // Validate limit parameter
  let validatedLimit = 20 // Default limit
  if (limit !== undefined) {
    if (typeof limit !== "string" && typeof limit !== "number") {
      errors.push({
        field: "limit",
        message: "Limit parameter must be a string or number",
        code: "INVALID_TYPE",
      })
    } else {
      const sanitizedLimit = sanitizeString(String(limit))
      const parsedLimit = parseInt(sanitizedLimit, 10)

      if (
        isNaN(parsedLimit) ||
        parsedLimit < 1 ||
        !Number.isInteger(parsedLimit) ||
        parsedLimit.toString() !== sanitizedLimit
      ) {
        errors.push({
          field: "limit",
          message: "Limit must be a positive integer",
          code: "INVALID_LIMIT_FORMAT",
        })
      } else if (parsedLimit > 100) {
        // Reasonable limit to prevent DoS
        errors.push({
          field: "limit",
          message: "Limit is too large (max 100)",
          code: "LIMIT_TOO_LARGE",
        })
      } else {
        validatedLimit = parsedLimit
      }
    }
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  return {
    success: true,
    data: {
      page: validatedPage,
      limit: validatedLimit,
      offset: (validatedPage - 1) * validatedLimit,
    },
    errors: [],
  }
}

/**
 * Sanitize word data for safe return in API responses
 * @param word - The word object to sanitize
 * @returns Sanitized word object
 */
export function sanitizeWordData(word: {
  id: number
  wordFrom: string
  wordTo: string
  exampleFrom: string
  exampleTo: string
  langFrom: string
  langTo: string
  typeCode: string
  typeName: string
  createdAt: Date
  tag?: string | null
}) {
  return {
    id: word.id,
    wordFrom: word.wordFrom,
    wordTo: word.wordTo,
    exampleFrom: word.exampleFrom,
    exampleTo: word.exampleTo,
    langFrom: word.langFrom,
    langTo: word.langTo,
    typeCode: word.typeCode,
    typeName: word.typeName,
    createdAt: word.createdAt,
    tag: word.tag,
  }
}

/**
 * Sanitize user data for safe return in API responses
 * @param user - The user object to sanitize
 * @returns Sanitized user object
 */
export function sanitizeUserData(user: {
  id: string
  email: string
  name: string | null
  userLanguage: string
  learnedLanguage: string
  role: string
  createdAt: Date
  updatedAt: Date
  _count?: { userWords: number }
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    userLanguage: user.userLanguage,
    learnedLanguage: user.learnedLanguage,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    wordCount: user._count?.userWords || 0,
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
