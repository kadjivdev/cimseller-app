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
import { useColumns, Vente } from "../vente/columns"
import { TableActions } from "@/myComponents/TableActions"
import { getStandardVenteExportColumns } from "@/lib/venteExportColumns"
import { Card } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings2 } from "lucide-react"

// modals
import UpdateVenteModal from "./update-modal"
import DeleteVenteModal from "./delete-modal"
import ValidVenteModal from "./valid-modal"
import ReglementsVenteModal from "./reglements-vente-modal"

import { DatePickerRange } from "@/myComponents/DatePickerRange"
import { MyPagination } from "@/components/MyPagination"

const exportColumns = getStandardVenteExportColumns<any>()

export function DataTable({ data, date, setDate,selectedProgrammation, handleProgrammationSelect }:any) {

    const [open, setOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [openValid, setOpenValid] = useState(false)
    const [openReglement, setOpenReglements] = useState(false)
    const [selectedVente, setSelectedVente] = useState<Vente | null>(null)

    const [globalFilter, setGlobalFilter] = useState("")
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({}) // ✅ Nouveau

    // 
    const handleEdit = (vente: Vente) => {
        setSelectedVente(vente)
        setOpen(true)
    }

    const handleDelete = (vente: Vente) => {
        setSelectedVente(vente)
        setOpenDelete(true)
    }

    const handleValid = (vente: Vente) => {
        setSelectedVente(vente)
        setOpenValid(true)
    }

    const onShowReglements = (vente: Vente)=>{
        setSelectedVente(vente)
        setOpenReglements(true)
    }

    const columns = useColumns(handleEdit, handleDelete, handleValid,onShowReglements) // 👈 passe les callbacks

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
                                            Aucune vente.
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

            {/* validation de vente */}
            <ValidVenteModal
                open={openValid}
                onOpenChange={setOpenValid}
                vente={selectedVente}
                handleProgrammationSelect={handleProgrammationSelect}
            />

            {/* update vente */}
            <UpdateVenteModal
                open={open}
                onOpenChange={setOpen}
                vente={selectedVente}
                selectedProgrammation={selectedProgrammation}
                handleProgrammationSelect={handleProgrammationSelect}
            />

            {/* suppression de vente */}
            <DeleteVenteModal
                open={openDelete}
                onOpenChange={setOpenDelete}
                vente={selectedVente}
                handleProgrammationSelect={handleProgrammationSelect}
            />

            {/* voir les reglements de vente */}
            <ReglementsVenteModal
                open={openReglement}
                onOpenChange={setOpenReglements}
                vente={selectedVente}
            />
        </>
    )
}