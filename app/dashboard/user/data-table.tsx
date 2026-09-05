"use client"

import { useState } from "react"
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
import { useColumns, User } from "../user/columns"
import { TableActions } from "./tableActions"
import { Card } from "@/components/ui/card"
import {
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenu,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, ArrowRight, Import, Settings2 } from "lucide-react"

// modals
import UpdateUserModal from "./modal"
import DeleteUserModal from "./delete-modal"
import ImportUserModal from "./import"
import { MyPagination } from "@/components/MyPagination"

const exportColumns = [
    { label: "Nom Complet", key: "fullname" as const },
    { label: "Email", key: "email" as const },
    // { label: "Rôle", key: "role.name" as const },
    // { label: "Zone", key: "zone.name" as const },
    { label: "Rôle", key: "role", accessor: (row:any) => row.role?.name ?? "—" },
    { label: "Zone", key: "zone", accessor: (row:any) => row.zone?.name ?? "—" },
    { label: "Crée le", key: "createdAt" as const },
]

export function DataTable({ data, setReload }:any) {
    const [open, setOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [openImport, setOpenImport] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const [globalFilter, setGlobalFilter] = useState("")
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({}) // ✅ Nouveau

    // 
    const handleEdit = (user: User) => {
        setSelectedUser(user)
        setOpen(true)
    }

    const handleDelete = (user: User) => {
        setSelectedUser(user)
        setOpenDelete(true)
    }

    const columns = useColumns(handleEdit, handleDelete) // 👈 passe les callbacks

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

                    {/* session importation */}
                    <div className="d-flex justify-content-center">
                        <Button variant="outline"
                            className="border rounded bg-dark shadow-sm text-white"
                            onClick={()=>setOpenImport(true)}>
                            <Import /> Importer des utilisateurs
                        </Button>
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
                                            Aucun untilisateur trouvé.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* ── Pagination avec numéros de page ── */}
                    <MyPagination table={table}/>
                </div>
            </Card>

            {/* ✅ Une seule instance du modal pour toute la table */}
            <UpdateUserModal
                open={open}
                onOpenChange={setOpen}
                user={selectedUser}
                setReload={setReload}
            />

            {/* suppression de compte */}
            <DeleteUserModal
                open={openDelete}
                onOpenChange={setOpenDelete}
                user={selectedUser}
                setReload={setReload}
            />

            {/* Importation de comptes */}
            <ImportUserModal
                open={openImport}
                onOpenChange={setOpenImport}
                setReload={setReload}
            />
        </>
    )
}