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

export type Role = {
  id: number
  name: string
  description: string
  created_at: string
}

// export type Name:String

export function useColumns(onEdit: (role: Role) => void, onDelete: (role: Role) => void): ColumnDef<Role>[] {
  // verifier si le user a cette permission
  // const isUserPermitted = (name:String) => {
  //   return (rolePermissions).some(per => per.name == name);
  // }

  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button className="w-100" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nom <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.getValue("name") || "—",
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button className="w-100" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Description <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.getValue("description") || "—",
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button className="w-100" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Crée le <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Formater la date
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string
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
        <Button className="w-100" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Actions <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const role = row.original
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
                  onEdit(role) // 👈 remonte juste le role
                }}
              >
                <PencilLine /> Modifier
              </DropdownMenuItem>

              <DropdownMenuItem
                style={{ cursor: "pointer" }}
                className="text-danger"
                onSelect={(e) => {
                  e.preventDefault()
                  onDelete(role) // 👈 remonte juste le role
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