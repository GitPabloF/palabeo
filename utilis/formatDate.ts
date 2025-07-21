/**
 * @description Get the number of days ago from the createdAt date
 * @param createdAt - The createdAt date
 * @returns The number of days ago
 */
export function getDaysAgo(createdAt: string): string {
  const createdAtDate = new Date(createdAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - createdAtDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  // handle months and days
  if (diffDays > 30) {
    const months = Math.floor(diffDays / 30)
    if (months === 1) {
      return "1 month ago"
    }
    return `${months} months ago`
  }
  if (diffDays === 1) {
    return "1 day ago"
  }
  return `${diffDays} days ago`
}
