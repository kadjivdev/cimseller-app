// app/components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown,  MoreHorizontal, PencilLine} from "lucide-react"
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

export type Recu = {
  id: number
  commande: {
    id: Number,
    code: String,
  }
  createdBy: {
    id: Number,
    fullname: String,
  }
  code: string
  reference: string
  libelle: string
  tonnage: string
  montant: Number
  date: Number
  preuve: String
  createdAt: string
}

export function useColumns(): ColumnDef<Recu>[] {
  // verifier si le user a cette permission
  // const isUserPermitted = (name:String) => {
  //   return (rolePermissions).some(per => per.name == name);
  // }

  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          N° <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        return row.getValue("id") || "—"
      },
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Code <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{row.getValue("code") || "—"}</span>,
    },
    {
      accessorKey: "reference",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Reference <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{row.getValue("reference") || "—"}</span>,
    },
    {
      accessorKey: "libelle",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Libelle <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{row.getValue("libelle") || "—"}</span>,
    },
    {
      accessorKey: "tonnage",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tonnage <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.tonnage ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
    {
      accessorKey: "montant",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Montant <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.montant ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        const date = row.getValue("date") as string
        return date
          ? new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          : "—"
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Crée le <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Formater la date
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string
        return new Date(date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      },
    },
    {
      accessorKey: "createdBy",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Crée par <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border rounded text-dark"> {row.original.createdBy?.fullname || "—"} </span>,
    },
    // 
    {
      id: "actions",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Actions <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const recu = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 shadow-sm rounded bg-dark text-white">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* modifier */}
              <DropdownMenuItem
                style={{ cursor: "pointer" }}
                className="text-warning"
                onSelect={(e) => {
                  e.preventDefault()
                  handleVersement(recu) // 👈 remonte juste du bon
                }}
              >
                <PencilLine /> Les versements
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}