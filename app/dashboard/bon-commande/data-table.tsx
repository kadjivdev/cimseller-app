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
import { useColumns, Bon } from "../bon-commande/columns"
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
import UpdateBonModal from "./modal"
import ShowBonModal from "./show-modal"
import RecuBonModal from "./recus-modal"
import AccuseBonModal from "./accuses-modal"
import DeleteBonModal from "./delete-modal"
import ValidBonModal from "./valid-modal"
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

export function DataTable({ data, setReload, bons, types, status, date, setDate, totalAmount }) {

    const [open, setOpen] = useState(false)
    const [openShow, setOpenShow] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [openValid, setOpenValid] = useState(false)
    const [openRecu, setOpenRecu] = useState(false)
    const [openAccuse, setOpenAccuse] = useState(false)
    const [selectedBon, setSelectedBon] = useState<Bon | null>(null)

    const [globalFilter, setGlobalFilter] = useState("")
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({}) // ✅ Nouveau

    // 
    const handleEdit = (bon: Bon) => {
        setSelectedBon(bon)
        setOpen(true)
    }

    const handleShow = (bon: Bon) => {
        setSelectedBon(bon)
        setOpenShow(true)
    }

    const handleDelete = (bon: Bon) => {
        setSelectedBon(bon)
        setOpenDelete(true)
    }

    const handleValid = (bon: Bon) => {
        setSelectedBon(bon)
        setOpenValid(true)
    }

    const handleRecu = (bon: Bon) => {
        setSelectedBon(bon)
        setOpenRecu(true)
    }

    const handleAccuse = (bon: Bon) => {
        setSelectedBon(bon)
        setOpenAccuse(true)
    }

    const columns = useColumns(handleEdit, handleShow, handleDelete, handleValid, handleRecu, handleAccuse) // 👈 passe les callbacks

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

                    {/* Total amount */}
                    <h3 className="">Montant total: <span className="badge bg-dark border text-light rounded">$ {totalAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} </span></h3>
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
                                            Aucun bon trouvé.
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

            {/* ✅ Une seule instance du modal pour toute la table */}
            <UpdateBonModal
                open={open}
                onOpenChange={setOpen}
                bon={selectedBon}
                setReload={setReload}
            />

            {/* ✅ Une seule instance du modal pour toute la table */}
            <ShowBonModal
                open={openShow}
                onOpenChange={setOpenShow}
                bon={selectedBon}
            />

            {/* RecuBonModal */}
            <RecuBonModal
                open={openRecu}
                onOpenChange={setOpenRecu}
                bon={selectedBon}
                setReload={setReload}
            />

            {/* AccuseBonModal */}
            <AccuseBonModal
                open={openAccuse}
                onOpenChange={setOpenAccuse}
                bon={selectedBon}
                setReload={setReload}
            />

            {/* validation de aprovisionnement */}
            <ValidBonModal
                open={openValid}
                onOpenChange={setOpenValid}
                bon={selectedBon}
                setReload={setReload}
            />

            {/* suppression de bon */}
            <DeleteBonModal
                open={openDelete}
                onOpenChange={setOpenDelete}
                bon={selectedBon}
                setReload={setReload}
            />
        </>
    )
}