"use client"

import { useEffect, useState } from "react"
import {
    VisibilityState, // ✅ Import
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getCoreRowModel,
    useReactTable,
    SortingState,
    flexRender,
} from "@tanstack/react-table"
import {
    TableHead, TableHeader, TableRow,
    Table, TableBody, TableCell,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useColumns, Vente } from "./columns"
import { TableActions } from "./tableActions"
import { getTraiterVenteExportColumns } from "@/lib/venteExportColumns"
import { Card } from "@/components/ui/card"
import {
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenu,
} from "@/components/ui/dropdown-menu"
import { FolderUp, Settings2 } from "lucide-react"

// modals

import { DatePickerRange } from "@/myComponents/DatePickerRange"
import ExportVentesModal from "./export-ventes-modal";
import { MyPagination } from "@/components/MyPagination"

const exportColumns = getTraiterVenteExportColumns()

const getNestedSearchText = (value: unknown): string[] => {
    if (value == null) return []
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return [String(value)]
    }
    if (Array.isArray(value)) {
        return value.flatMap((item) => getNestedSearchText(item))
    }
    if (typeof value === "object") {
        return Object.values(value as Record<string, unknown>).flatMap((item) => getNestedSearchText(item))
    }
    return []
}

const globalSearchFilter = (row: any, columnId: string, filterValue: unknown) => {
    const keyword = String(filterValue ?? "").trim().toLowerCase()
    if (!keyword) return true

    const searchableText = getNestedSearchText(row.original)
        .join(" ")
        .toLowerCase()

    return searchableText.includes(keyword)
}

export function DataTable({ data, date, setDate,setReload}:any) {

    const [exportBoolean,setExportBoolean] =useState(false)
    const [globalFilter, setGlobalFilter] = useState("")
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({}) // ✅ Nouveau

    const columns = useColumns() // 👈 passe les callbacks

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter, columnVisibility }, // ✅ Ajouté
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility, // ✅ Ajouté
        globalFilterFn: globalSearchFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    // 
    const exportVentes = ()=>{
        setExportBoolean(true)
    }

    return (
        <>
            <Card className="p-2">
                <div className="space-y-4">

                    {/* Filtre par période */}
                    <DatePickerRange
                        date={date}
                        setDate={setDate}
                    />

                    {/*  */}
                    <div className="d-flex justify-content-center">
                        <button 
                            className="btn btn-sm shadow-sm bg-success border rounded text-white d-flex align-items-center gap-2"
                            onClick={exportVentes}
                        >
                            <FolderUp size={16} /> Exporter toutes les ventes traitées
                        </button>
                    </div>


                    {/* ── HEADER ── */}
                    <div className="flex items-center justify-between gap-4 no-print bg-dark p-2 rounded">
                        <Input
                            placeholder="Rechercher..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="max-w-sm text-white"
                        />

                        <div className="flex items-center gap-2">
                            {/* ✅ Bouton visibilité des colonnes */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="rounded shadow-sm" variant="outline" size="sm">
                                        <Settings2 className="mr-2 h-4 w-4" />
                                        Colonnes
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((col) => col.getCanHide())
                                        .map((col) => (
                                            <DropdownMenuCheckboxItem
                                                key={col.id}
                                                className="capitalize"
                                                checked={col.getIsVisible()}
                                                onCheckedChange={(value) => col.toggleVisibility(!!value)}
                                            >
                                                {col.id}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <TableActions
                                data={data}
                                columns={exportColumns}
                                filename="ventes"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border">
                        <Table className="table table-striped-columns">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} className="text-lg">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="text-center">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                            Aucune vente à comptabiliser.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <MyPagination table={table}/>
                </div>
            </Card>

            {/* Export des ventes traitées */}
            <ExportVentesModal
                open={exportBoolean}
                onOpenChange={setExportBoolean}
                setReload={setReload}
            />
        </>
    )
}