// app/components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eraser, Eye, ListOrdered, MoreHorizontal, PencilLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export type Client = {
  id: number
  zone: {
    id: Number
    name: String
  }
  statut: {
    id: Number
    name: String
  }
  raison_sociale: String
  profil: String
  phone: String
  email: string
  adresse: String
  createdAt: string
}

// export type Name:String

export function useColumns(onEdit: (client: Client) => void, onDelete: (client: Client) => void, onShowApprovisionnement: (client: Client) => void, onShowReglement: (client: Client) => void): ColumnDef<Client>[] {
  // verifier si le user a cette permission
  // const isUserPermitted = (name:String) => {
  //   return (rolePermissions).some(per => per.name == name);
  // }

  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          N° <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.getValue("id") || "—",
    },
    {
      accessorKey: "raison_sociale",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Raison sociale <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light text-dark border"> {row.getValue("raison_sociale") || "—"}</span>,
    },
    {
      accessorKey: "approvisionnementAmount",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Montant approvisionné <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        let client = row.original
        return <>
          <span className="badge bg-light text-danger border">{row.getValue("approvisionnementAmount")?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"}</span> <br />
          <button
            className="btn-sm bg-dark px-2 mt-1 text-white rounded border shadow-sm"
            onClick={(e) => {
              e.preventDefault()
              onShowApprovisionnement(client)
            }}
          ><ListOrdered /></button>
        </>
      }
    },
    {
      accessorKey: "reglementAmount",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Montant réglé <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        let client = row.original
        return <>
          <span className="badge bg-light text-warning border">{row.getValue("reglementAmount")?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"}</span> <br />
          <button
            className="btn-sm bg-dark px-2 mt-1 text-white rounded border shadow-sm"
            onClick={(e) => {
              e.preventDefault()
              onShowReglement(client)
            }}
          ><ListOrdered /></button>
        </>
      },
    },
    {
      accessorKey: "solde",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Solde Client <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light text-success text-lg border">{(row.getValue('approvisionnementAmount') - row.getValue('reglementAmount')).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"}</span>,
    },
    {
      accessorKey: "zone",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Zone <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {row.original.zone?.name || "—"} </span>,
    },
    {
      accessorKey: "statut",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className={`badge bg-light border ${row.original.statut?.id == 1 ? 'text-success' : (row.original.statut?.id == 2 ? 'text-danger' : 'text-warning')}`}> {row.original.statut?.name || "—"} </span>,
    },
    {
      accessorKey: "profil",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Profil <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.original?.profil ? <Link href={row.original?.profil}><Eye /></Link> : "—",
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Télephone <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.getValue("phone") || '--',
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.getValue("email") || '--',
    },
    {
      accessorKey: "adresse",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Adresse <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.getValue("adresse"),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Crée le <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Formater la date
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string
        if (!date) {
          return new Date().toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        } else {
          return new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        }
      },
    },
    // 
    {
      id: "actions",
      header: ({ column }) => (
        <Button className="w-100 rounded border" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Actions <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const client = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 shadow-sm rounded">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                style={{ cursor: "pointer" }}
                className="text-warning"
                onSelect={(e) => {
                  e.preventDefault()
                  onEdit(client) // 👈 remonte juste le client
                }}
              >
                <PencilLine /> Modifier
              </DropdownMenuItem>

              <DropdownMenuItem
                style={{ cursor: "pointer" }}
                className="text-danger"
                onSelect={(e) => {
                  e.preventDefault()
                  onDelete(client) // 👈 remonte juste le client
                }}>
                <Eraser /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}