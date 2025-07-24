import { useState, useMemo } from "react"

interface UseSearchProps<T> {
  items: T[]
  searchFields: (keyof T)[]
}

export function useSearch<T>({ items, searchFields }: UseSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items

    return items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field]
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })
    )
  }, [items, searchFields, searchTerm])

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  }
}
