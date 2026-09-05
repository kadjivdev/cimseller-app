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

export type Zone = {
  id: number
  name: string
  description: string
  createdAt: string
  representant:{
    id:number
    nom:string
    prenom:string
  }
}

// export type Name:String

export function useColumns(onEdit: (zone: Zone) => void, onDelete: (user: Zone) => void): ColumnDef<Zone>[] {
 
  return [
    // 
    {
      id: "actions",
      header: ({ column }) => (
        <Button className="w-100 rounded " variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Actions <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const zone = row.original
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
                  onEdit(zone) // 👈 remonte juste le role
                }}
              >
                <PencilLine /> Modifier
              </DropdownMenuItem>

              <DropdownMenuItem
                style={{ cursor: "pointer" }}
                className="text-danger"
                onSelect={(e) => {
                  e.preventDefault()
                  onDelete(zone) // 👈 remonte juste le role
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
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          N° <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nom <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.getValue("name") || "—",
    },
    {
      accessorKey: "representant",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Representant <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      // cell: ({ row }) => row.original.representant? <span className="badge border rounded text-dark">{row.original.representant?.nom} - {row.original.representant?.prenom}</span> :'--',
      cell: ({ row }) => <span className="badge border rounded text-dark">{row.original.representant?.nom} - {row.original.representant?.prenom}</span> ,

    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Description <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.original.description || "—",
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