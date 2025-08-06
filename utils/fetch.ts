/**
 * Handle API error
 * @param response - The response from the API
 */
export const handleApiError = (response: Response) => {
  return { message: response.statusText, status: response.status }
}

/**
 * API request
 * @param url - The URL to request
 * @param options - The options for the request
 * @returns The response from the API
 */
export const apiRequest = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    handleApiError(response)
    return null
  }

  return response.json()
}
