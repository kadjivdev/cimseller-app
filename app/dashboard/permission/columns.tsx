// app/components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Permission = {
  id: number
  name: string
  description: string
  created_at: string
}

export const columns: ColumnDef<Permission>[] = [
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
]