import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

const MAX_VISIBLE = 10

// Génère une fenêtre de max 10 pages autour de la page courante
function getPageNumbers(current, total, maxVisible = MAX_VISIBLE) {
    if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    let start = Math.max(1, current - Math.floor(maxVisible / 2))
    let end = start + maxVisible - 1

    if (end > total) {
        end = total
        start = end - maxVisible + 1
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function MyPagination({ table }) {
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

                {pageNumbers.map((page) => (
                    <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        className={`w-9 rounded border ${page === currentPage ? 'bg-warning text-white' : ''}`}
                        onClick={() => table.setPageIndex(page - 1)}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    className="border rounded shadow-sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ArrowRight />
                </Button>
            </div>
        </div>
    )
}