import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type CustomPaginationProps = {
  pageSize: number
  length: number
  index: number
}

export default function CustomPagination({
  pageSize,
  length,
  index,
}: CustomPaginationProps) {
  const displayPagination = length > pageSize

  const totalPages = Math.ceil(length / pageSize)

  /**
   * Returns an array of page numbers and ellipses for pagination.
   * Adapts output based on total pages and current index.
   */
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 5) return [...Array(totalPages)].map((_, i) => i + 1)
    if (length <= 3) return [1, 2, 3, 4, "...", totalPages]
    if (length >= totalPages - 2)
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    return [1, "...", index - 1, index, index + 1, "...", totalPages]
  }

  return (
    <>
      {displayPagination && (
        <div className="px-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?page=${index - 1}`}
                  aria-disabled={index === 1}
                  className={
                    index === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={i}>
                    <PaginationLink href={`?page=${p}`} isActive={index === p}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href={`?page=${index + 1}`}
                  aria-disabled={index === totalPages}
                  className={
                    index === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  )
}
