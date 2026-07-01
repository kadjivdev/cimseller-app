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
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export type Produit = {
  id: number
  name: string
  description: string
  fournisseurPrice: Number
  type: {
    id: Number,
    name: String,
  }
  typeId: Number
  image: string
  createdAt: string
}

// export type Name:String

export function useColumns(onEdit: (produit: Produit) => void, onDelete: (produit: Produit) => void): ColumnDef<Produit>[] {
  // verifier si le user a cette permission
  // const isUserPermitted = (name:String) => {
  //   return (rolePermissions).some(per => per.name == name);
  // }

  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button className="w-100" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          N° <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.getValue("id") || "—",
    },
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
      accessorKey: "type",
      header: ({ column }) => (
        <Button className="w-100" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Type <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {row.original.type?.name || "—"} </span>,
    },
    {
      accessorKey: "fournisseurPrice",
      header: ({ column }) => (
        <Button className="w-100" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prix fournisseur <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.getValue("fournisseurPrice") || "—",
    },
    {
      accessorKey: "image",
      header: ({ column }) => (
        <Button className="w-100" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Image <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => row.original?.image? <Link href={row.original?.image}/>:'--',
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button className="w-100" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Description <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <Textarea defaultValue={row.getValue("description") || "—"} rows={1}></Textarea>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button className="w-100" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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
        <Button className="w-100" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Actions <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const produit = row.original
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
                  onEdit(produit) // 👈 remonte juste le produit
                }}
              >
                <PencilLine /> Modifier
              </DropdownMenuItem>

              <DropdownMenuItem
                style={{ cursor: "pointer" }}
                className="text-danger"
                onSelect={(e) => {
                  e.preventDefault()
                  onDelete(produit) // 👈 remonte juste le produit
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