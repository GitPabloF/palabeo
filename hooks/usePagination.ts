import { useState, useMemo } from "react"

interface UsePaginationProps<T> {
  items: T[]
  pageSize: number
  currentPage: number
}

export function usePagination<T>({
  items,
  pageSize,
  currentPage,
}: UsePaginationProps<T>) {
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return items.slice(startIndex, endIndex)
  }, [items, pageSize, currentPage])

  const totalPages = Math.ceil(items.length / pageSize)

  return {
    paginatedItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  }
}
