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
import { useColumns, Client } from "../client/columns"
import { TableActions } from "./tableActions"
import { Card } from "@/components/ui/card"
import {
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenu,
} from "@/components/ui/dropdown-menu"
import { Import, Settings2 } from "lucide-react"

// modals
import UpdateClientModal from "./modal"
import ProfilClientModal from "./profil"
import DeleteClientModal from "./delete-modal"
import ImportClientModal from "./import"
import ShowApprovisionnements from "./approvisionnement/showApprovisionnements"
import ShowReglements from "./reglement/showReglements"
import ShowVentes from "./vente/showVentes"
import { useApp } from "@/app/AppContext"

const exportColumns = [
    { label: "Raison sociale ", key: "raison_sociale" as const },
    { label: "Zone ", key: "zone" as const },
    { label: "Statut ", key: "statut" as const },
    { label: "Profil", key: "profil" as const },
    { label: "Montant approvisionné", key: "approvisionnementAmount" as const },
    { label: "Vente validée", key: "venteAmount" as const },
    { label: "Montant réglé", key: "reglementAmount" as const },
    { label: "Solde client", key: "solde" as const },
    { label: "Téléphone", key: "phone" as const },
    { label: "Email", key: "email" as const },
    { label: "Adresse", key: "adresse" as const },
    { label: "Crée le", key: "createdAt" as const },
]

export function DataTable({ data, setReload, zones, status }:any) {
    const { user} = useApp()

    const [open, setOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [openProfil, setOpenProfil] = useState(false)

    const [openShowApprovisionnement, setOpenShowApprovisionnement] = useState(false)
    const [openShowReglement, setOpenShowReglement] = useState(false)
    const [openShowVente, setOpenShowVente] = useState(false)
    const [openImport, setOpenImport] = useState(false)
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)

    const [globalFilter, setGlobalFilter] = useState("")
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({}) // ✅ Nouveau

    console.log("User agent's :", user)
    const isPermittedTo = (name) => {
        return user?.role?.permissions?.some((pr) => pr.name == name)
    }

    // 
    const handleEdit = (client: Client) => {
        setSelectedClient(client)
        setOpen(true)
    }

    const handleDelete = (client: Client) => {
        setSelectedClient(client)
        setOpenDelete(true)
    }

    const handleProfil = (client: Client) => {
        setSelectedClient(client)
        setOpenProfil(true)
    }

    const handleShowApprovisionnement = (client: Client) => {
        setSelectedClient(client)
        setOpenShowApprovisionnement(true)
    }

    const handleShowReglement = (client: Client) => {
        setSelectedClient(client)
        setOpenShowReglement(true)
    }

    const onShowVenteReglement = (client:Client)=>{
        setSelectedClient(client)
        setOpenShowVente(true)
    }

    const columns = useColumns(handleEdit, handleDelete, handleShowApprovisionnement, handleShowReglement,onShowVenteReglement,handleProfil) // 👈 passe les callbacks

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
                                filename="clients"
                            />
                        </div>
                    </div>

                    {/* session importation */}
                    {isPermittedTo("client.create") ?
                    <div className="d-flex justify-content-center">
                        <Button variant="outline"
                            className="border rounded bg-dark shadow-sm text-white"
                            onClick={() => setOpenImport(true)}>
                            <Import /> Importer des clients
                        </Button>
                    </div>:
                    <p className="text-center text-danger">Vous n'êtes pas autorisé.e à acceder à cette page.</p>
                    }

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
                                            Aucun client trouvé.
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
            <UpdateClientModal
                open={open}
                onOpenChange={setOpen}
                client={selectedClient}
                setReload={setReload}
                zones={zones}
                status={status}
            />

            <DeleteClientModal
                open={openDelete}
                onOpenChange={setOpenDelete}
                client={selectedClient}
                setReload={setReload}
            />

            <ProfilClientModal
                open={openProfil}
                onOpenChange={setOpenProfil}
                client={selectedClient}
                setReload={setReload}
            />

            {/* Importation de comptes */}
            <ImportClientModal
                open={openImport}
                onOpenChange={setOpenImport}
                setReload={setReload}
                status={status}
            />

            {/* Afficher les approvisionnements */}
            <ShowApprovisionnements
                open={openShowApprovisionnement}
                onOpenChange={setOpenShowApprovisionnement}
                client={selectedClient}
            />

            {/* Afficher les ventes */}
            <ShowVentes
                open={openShowVente}
                onOpenChange={setOpenShowVente}
                client={selectedClient}
            />

            {/* Afficher les reglements */}
            <ShowReglements
                open={openShowReglement}
                onOpenChange={setOpenShowReglement}
                client={selectedClient}
            />
        </>
    )
}