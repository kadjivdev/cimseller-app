// app/components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CircleCheckBig, CircleX, Eraser, Eye, FolderPlus, MoreHorizontal, PencilLine, ReceiptText, ShoppingCart, Van } from "lucide-react"
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

export type Bon = {
  id: number
  fournisseur: {
    id: Number,
    raison_sociale: String,
  }
  statut: {
    id: Number,
    name: String,
  }
  type: {
    id: Number,
    name: String,
  }
  validatedBy: {
    id: Number,
    fullname: String,
  }
  createdBy: {
    id: Number,
    fullname: String,
  }
  code: string
  reference: string
  qteCommander: string
  qteProgrammer: string
  qteVendu: string
  montant: Number
  stock: Number
  date: Number
  createdAt: string
  validatedAt: string
}

export function useColumns(
  onEdit: (bon: Bon) => void,
  onShow: (bon: Bon) => void,
  onDelete: (bon: Bon) => void,
  onValid: (bon: Bon) => void,
  handleRecu: (bon: Bon) => void,
  handleAccuse: (bon: Bon) => void)
  : ColumnDef<Bon>[] {
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
      accessorKey: "fournisseur",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Fournisseur <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{row.original?.fournisseur?.raison_sociale || "—"}</span>,
    },
    {
      accessorKey: "qtecommander",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Quantité Commandée <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.qteCommander ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
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
      accessorKey: "qteprogrammer",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Quantité Programmée <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.qteProgrammer ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
    {
      accessorKey: "qtevendu",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Quantité Vendue <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.qteVendu ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Stock <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-danger border text-white"> {(row.original.stock ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
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
      accessorKey: "type",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Type commande <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light text-dark bordezr rounded">{row.original.type?.name || "—"}</span>,
    },
    {
      accessorKey: "statut",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Statut <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        let statut = row.original.statut
        let classText = ''
        let icon;
        switch (statut?.id) {
          case 1:
            classText = 'bg-white text-dark'//programmé
            icon = <Van />
            break;
          case 2:
            classText = 'bg-success text-white'//livrée
            icon = <ShoppingCart />
            break;
          case 3:
            classText = 'bg-dark text-white'//validée
            icon = <CircleCheckBig />
            break;
          default:
            break;
        }
        return <>
          <span className={`flex items-center gap-1 whitespace-nowrap badge border ${classText}`}>
            <span className="[&>svg]:size-3">{icon}</span> {row.original.statut?.name || "—"}
          </span>
        </>
      }
    },
    {
      accessorKey: "validatedAt",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Validé le <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        const date = row.getValue("validatedAt") as string
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
      accessorKey: "validatedBy",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Validé par <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border rounded text-dark"> {row.original.validatedBy?.fullname || "—"} </span>,
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
        const bon = row.original
        return (
          !bon.validatedBy ?
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
                    onEdit(bon) // 👈 remonte juste du bon
                  }}
                >
                  <PencilLine /> Modifier
                </DropdownMenuItem>

                {/* show */}
                <DropdownMenuItem
                  style={{ cursor: "pointer" }}
                  className="text-info"
                  onSelect={(e) => {
                    e.preventDefault()
                    onShow(bon) // 👈 remonte juste du bon
                  }}
                >
                  <Eye /> Voir
                </DropdownMenuItem>

                {/* Reçus */}
                <DropdownMenuItem
                  style={{ cursor: "pointer" }}
                  className="text-dark"
                  onSelect={(e) => {
                    e.preventDefault()
                    handleRecu(bon) // 👈 remonte juste du bon
                  }}
                >
                  <ReceiptText /> Reçus
                </DropdownMenuItem>

                {/* Accusés */}
                <DropdownMenuItem
                  style={{ cursor: "pointer" }}
                  className="text-dark"
                  onSelect={(e) => {
                    e.preventDefault()
                    handleAccuse(bon) // 👈 remonte juste du bon
                  }}
                >
                  <FolderPlus /> Accusés
                </DropdownMenuItem>

                {/* valider */}
                <DropdownMenuItem
                  style={{ cursor: "pointer" }}
                  className="text-success"
                  onSelect={(e) => {
                    e.preventDefault()
                    onValid(bon) // 👈 remonte juste de l'approvisionnement
                  }}
                >
                  <CircleCheckBig /> Valider
                </DropdownMenuItem>

                {/* suppression */}
                <DropdownMenuItem
                  style={{ cursor: "pointer" }}
                  className="text-danger"
                  onSelect={(e) => {
                    e.preventDefault()
                    onDelete(approvisionnement) // 👈 remonte juste de l'approvisionnement
                  }}>
                  <Eraser /> Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : '--'
        )
      },
    },
  ]
}