import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"


// ✅ Génère la liste des pages à afficher avec ellipses
function getPageNumbers(current,total) {
    const delta = 1 // nombre de pages visibles autour de la page courante
    const range = []
    const rangeStart = Math.max(1, current - delta)
    const rangeEnd = Math.min(total, current + delta)

    if (rangeStart > 1) {
        range.push(1)
        if (rangeStart > 2) range.push("ellipsis")
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
        range.push(i)
    }

    if (rangeEnd < total) {
        if (rangeEnd < total - 1) range.push("ellipsis")
        range.push(total)
    }

    return range
}

export function MyPagination({table}) {
    const currentPage = table.getState().pagination.pageIndex + 1
    const pageCount = table.getPageCount()
    const pageNumbers = getPageNumbers(currentPage, pageCount)

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
                Page {currentPage} sur {pageCount}
            </p>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded shadow-sm border"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ArrowLeft />
                </Button>

                {pageNumbers.map((page, idx) =>
                    page === "ellipsis" ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground select-none">
                            …
                        </span>
                    ) : (
                        <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            className={`w-9 rounded border ${page === currentPage ? 'bg-dark text-white' : ''}`}
                            onClick={() => table.setPageIndex(page - 1)}
                        >
                            {page}
                        </Button>
                    )
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className="border rounded whadow-sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ArrowRight />
                </Button>
            </div>
        </div>
    )
}