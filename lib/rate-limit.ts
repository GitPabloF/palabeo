// Simple rate limiting with memory cache
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export async function checkRateLimit(
  identifier: string,
  maxRequests = 20
): Promise<boolean> {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute

  // Clean up expired entries
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key)
    }
  }

  const current = requestCounts.get(identifier)

  if (!current) {
    // First request
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return true
  }

  if (now > current.resetTime) {
    // Window expired, reset
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return true
  }

  if (current.count >= maxRequests) {
    // Rate limit dépassé
    return false
  }

  // Increment the counter
  current.count++
  return true
}
