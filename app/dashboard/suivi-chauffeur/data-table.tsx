"use client"

import { useState } from "react"
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
import { useColumns, Programmation } from "./columns"
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
import { DatePickerRange } from "@/myComponents/DatePickerRange"
import { MyPagination } from "@/components/MyPagination"

const exportColumns = [
    { label: "Code ", key: "code" as const },
    { label: "Date sortie ", key: "dateSortie" as const },
    { label: "Bon de commande", key: "commande" , accessor:(row:any)=>row.commande?.code?? "__" },
    { label: "Fournisseur", key: "fournisseur" , accessor:(row:any)=>row.commande?.fournisseur?.raison_sociale ?? "__" },
    { label: "Produit", key: "produit" , accessor:(row:any)=>row.commandeDetails?.[0].product?.name ?? "__" },
    { label: "Chauffeur", key: "chauffeur" , accessor:(row:any)=>row.chauffeur?.fullname?? "__" },
    { label: "Avaliseur", key: "avaliseur" , accessor:(row:any)=>row.avaliseur?.fullname?? "__" },
    { label: "Qte Programmée", key: "qteProgrammer" as const },
    { label: "Qte Vendue", key: "qteVendue" as const },
    { label: "Zone", key: "zone" , accessor:(row:any)=>row.zone?.name?? "__" },
    { label: "Bl", key: "bl" as const },
    { label: "Statut", key: "statut" , accessor:(row:any)=>row.statut?.name?? "__" },
    { label: "Validé le", key: "validatedAt" as const },
    { label: "Validé par", key: "validatedBy" as const },
    { label: "Crée le", key: "createdAt" as const },
    { label: "Crée par", key: "createdBy", accessor:(row:any)=>row.createdBy?.fullname?? "__" },
]

export function DataTable({ data,date, setDate,FournisseurfilterSelect,ChauffeurFilterSelect,CamionfilterSelect }:any) {

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
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <>
            <Card className="p-2">
                <div className="space-y-4">

                    <div className="row mb-2 text-center bg-light shadow-sm p-2">
                        <div className="col-md-6">
                            <FournisseurfilterSelect/>
                        </div>
                        <div className="col-md-6">
                            <ChauffeurFilterSelect/>
                        </div>
                        <div className="col-md-6">
                            <CamionfilterSelect/>
                        </div>
                    </div>

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
                                filename="suivi-chauffeur"
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
                   <MyPagination table={table}/>
                </div>
            </Card>
        </>
    )
}