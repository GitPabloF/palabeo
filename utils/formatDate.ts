/**
 * @description Get the number of days ago from the createdAt date
 * @param createdAt - The createdAt date
 * @returns The number of days ago
 */
export function getDaysAgo(createdAt: string): string {
  const today = new Date().toDateString()
  const createdDate = new Date(createdAt).toDateString()

  if (today === createdDate) {
    return "today"
  }

  const diffTime = new Date(today).getTime() - new Date(createdDate).getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
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
