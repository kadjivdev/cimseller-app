// app/components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eraser, MoreHorizontal, PencilLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Camion = {
  id: number
  marque: {
    id: number
    name: string
  }
  immatriculation: String
  libelle: String
  createdAt: string
}

// export type Name:String

export function useColumns(onEdit: (camion: Camion) => void, onDelete: (camion: Camion) => void): ColumnDef<Camion>[] {
  

  return [
    
    // 
    {
      id: "actions",
      header: ({ column }) => (
        <Button className="w-100 border rounded shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Actions <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const camion = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 shadow-sm rounded bg-warning text-white">
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
                  onEdit(camion) // 👈 remonte juste le role
                }}
              >
                <PencilLine /> Modifier
              </DropdownMenuItem>

              <DropdownMenuItem
                style={{ cursor: "pointer" }}
                className="text-danger"
                onSelect={(e) => {
                  e.preventDefault()
                  onDelete(camion) // 👈 remonte juste le camion
                }}>
                <Eraser /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button className="w-100 rounded border rounded shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          N° <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "marqueId",
      header: ({ column }) => (
        <Button className="w-100 rounded border rounded shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Marque <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.original ? <span className="badge border rounded text-dark">{row.original.marque?.name}</span> : "—",
    },
    {
      accessorKey: "immatriculation",
      header: ({ column }) => (
        <Button className="w-100 rounded border rounded shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Immatriculation <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.getValue("immatriculation") || "—",
    },
    {
      accessorKey: "libelle",
      header: ({ column }) => (
        <Button className="w-100 rounded border rounded shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Libelle <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.getValue("libelle") || "—",
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button className="w-100 rounded border rounded shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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
  ]
}