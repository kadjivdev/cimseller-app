"use client"

import { useEffect, useState } from "react"
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    VisibilityState, // ✅ Import
} from "@tanstack/react-table"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useColumns, Programmation } from "../programmation/columns"
import { TableActions } from "./tableActions"
import { Card } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings2 } from "lucide-react"

// modals
import UpdateProgrammationModal from "./update-modal"
import DeleteProgrammationModal from "./delete-modal"
import ValidProgrammationModal from "./valid-modal"
import { DatePickerRange } from "@/myComponents/DatePickerRange"

const exportColumns = [
    { label: "Code ", key: "code" as const },
    { label: "Fournisseur", key: "fournisseur" as const },
    { label: "Montant", key: "montant" as const },
    { label: "Type", key: "type" as const },
    { label: "Statut", key: "statut" as const },
    { label: "Validé le", key: "validatedAt" as const },
    { label: "Validé par", key: "validatedBy" as const },
    { label: "Crée le", key: "createdAt" as const },
    { label: "Crée par", key: "createdBy" as const },
]

export function DataTable({ data, setReload, date, setDate, handleBonSelect }) {

    const [open, setOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [openValid, setOpenValid] = useState(false)
    const [selectedProgrammation, setSelectedProgrammation] = useState<Programmation | null>(null)

    const [globalFilter, setGlobalFilter] = useState("")
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({}) // ✅ Nouveau

    // 
    const handleEdit = (programmation: Programmation) => {
        setSelectedProgrammation(programmation)
        setOpen(true)
    }

    const handleDelete = (programmation: Programmation) => {
        setSelectedProgrammation(programmation)
        setOpenDelete(true)
    }

    const handleValid = (programmation: Programmation) => {
        setSelectedProgrammation(programmation)
        setOpenValid(true)
    }

    const columns = useColumns(handleEdit, handleDelete, handleValid) // 👈 passe les callbacks

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter, columnVisibility }, // ✅ Ajouté
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility, // ✅ Ajouté
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })


    return (
        <>
            <Card className="p-2">
                <div className="space-y-4">

                    {/* Filtre par période */}
                    <DatePickerRange
                        date={date}
                        setDate={setDate}
                    />

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
                                filename="utilisateurs"
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
                                            Aucune programmation.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* validation de programmtion */}
            <ValidProgrammationModal
                open={openValid}
                onOpenChange={setOpenValid}
                programmation={selectedProgrammation}
                handleBonSelect={handleBonSelect}
            />

            {/* update programmation */}
            <UpdateProgrammationModal
                open={open}
                onOpenChange={setOpen}
                programmation={selectedProgrammation}
                handleBonSelect={handleBonSelect}
            />

            {/* suppression de bon */}
            <DeleteProgrammationModal
                open={openDelete}
                onOpenChange={setOpenDelete}
                programmation={selectedProgrammation}
                setReload={setReload}
            />
        </>
    )
}