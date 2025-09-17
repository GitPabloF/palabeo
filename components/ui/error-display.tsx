"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Error } from "@/types/response"

interface ErrorDisplayProps {
  error: Error | null
  onClear: () => void
  autoCloseDelay?: number
}

/**
 * Reusable error display component with auto-close functionality
 * @param error - The error object to display
 * @param onClear - Function to call when clearing the error
 * @param autoCloseDelay - Delay in milliseconds before auto-closing (default: 5000ms)
 */
export function ErrorDisplay({
  error,
  onClear,
  autoCloseDelay = 5000,
}: ErrorDisplayProps) {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onClear()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [error, onClear, autoCloseDelay])

  if (!error) return null

  return (
    <Card className="mb-6 border-red-200 bg-red-50 p-4">
      <div className="flex items-center">
        <span className="text-red-800 font-medium">{error.message}</span>
      </div>
    </Card>
  )
}
