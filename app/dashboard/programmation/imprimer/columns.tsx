// app/components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CircleCheckBig, CircleX, Van } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
export type Programmation = {
  id: number
  commande: {
    id: Number,
    code: String,
    fournisseur: {
      id: Number,
      raison_sociale: String
    }
  }
  statut: {
    id: Number,
    name: String,
  }
  zone: {
    id: Number,
    name: String,
  }
  camion: {
    id: Number,
    immatriculation: String,
    libelle: String,
  }
  chauffeur: {
    id: Number,
    fullname: String,
  }
  avaliseur: {
    id: Number,
    fullname: String,
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
  dateSortie: string
  dateProgrammation: string
  qteProgrammer: Number
  qteLivre: Number
  qteVendue: Number
  bl: string
  observation: String
  date: Number
  createdAt: string
  validatedAt: string
}

export function useColumns()
  : ColumnDef<Programmation>[] {
  // verifier si le user a cette permission
  // const isUserPermitted = (name:String) => {
  //   return (rolePermissions).some(per => per.name == name);
  // }

  return [
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => (
    //     <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //       N° <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   ),
    //   // ✅ Ajouter cell
    //   cell: ({ row }) => {
    //     return row.getValue("id") || "—"
    //   },
    // },
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
      accessorKey: "fournisseur",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Fournisseur <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{`${row.original?.commande?.fournisseur?.raison_sociale}` || "—"}</span>,
    },
    // {
    //   accessorKey: "dateSortie",
    //   header: ({ column }) => (
    //     <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //       Date sortie <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   ),
    //   // ✅ Ajouter cell
    //   cell: ({ row }) => {
    //     const date = row.original?.dateSortie
    //     return date
    //       ? new Date(date).toLocaleDateString("fr-FR", {
    //         day: "2-digit",
    //         month: "2-digit",
    //         year: "numeric",
    //       })
    //       : "--"
    //   }
    // },
    {
      accessorKey: "camion",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Camion <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{`${row.original?.camion?.immatriculation}-${row.original?.camion?.libelle}` || "—"}</span>,
    },
    {
      accessorKey: "chauffeur",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Chauffeur <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{`${row.original?.chauffeur?.fullname}` || "—"}</span>,
    },
    {
      accessorKey: "avaliseur",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Avaliseur <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{`${row.original?.avaliseur?.fullname}` || "—"}</span>,
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
    // {
    //   accessorKey: "qteVendue",
    //   header: ({ column }) => (
    //     <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //       Quantité Vendue <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   ),
    //   // ✅ Ajouter cell
    //   cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.qteVendue ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    // },
    {
      accessorKey: "zone",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Zone <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{`${row.original?.zone?.name}` || "—"}</span>,
    },
    // {
    //   accessorKey: "bl",
    //   header: ({ column }) => (
    //     <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //       Bl <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   ),
    //   // ✅ Ajouter cell
    //   cell: ({ row }) => <span className="badge bg-light border text-dark"> {row.original?.bl || "—"} </span>,
    // },
    {
      accessorKey: "statut",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Statut <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        let statut = row.original?.statut
        let classText = ''
        let statutText = null
        let icon;
        switch (statut?.id) {
          case 1:
            classText = 'bg-success text-white'//validée
            statutText = row.original?.statut?.name
            icon = <CircleCheckBig />
            break;
          case 2:
            classText = 'bg-danger text-white'//annulée
            statutText = row.original?.statut?.name
            icon = <CircleX />
            break;
          case 3:
            classText = 'bg-info text-white'//livrée
            statutText = row.original?.statut?.name
            icon = <Van />
            break;
          case 4:
            classText = 'bg-success text-white'//validée
            statutText = row.original?.statut?.name
            icon = <CircleCheckBig />
            break;
          default:
            classText = 'bg-dark text-white'//validée
            statutText = 'En Cours'
            icon = <CircleCheckBig />
            break;
        }
        return <>
          <span className={`flex items-center gap-1 whitespace-nowrap badge border ${classText}`}>
            <span className="[&>svg]:size-3">{icon}</span> {statutText || "—"}
          </span>
        </>
      }
    },
    // {
    //   accessorKey: "observation",
    //   header: ({ column }) => (
    //     <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //       Observation <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   ),
    //   // ✅ Ajouter cell
    //   cell: ({ row }) => <Textarea placeholder={row.getValue("observation")} />,
    // },
    // {
    //   accessorKey: "validatedAt",
    //   header: ({ column }) => (
    //     <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //       Validé le <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   ),
    //   // ✅ Ajouter cell
    //   cell: ({ row }) => {
    //     const date = row.getValue("validatedAt") as string
    //     return date
    //       ? new Date(date).toLocaleDateString("fr-FR", {
    //         day: "2-digit",
    //         month: "2-digit",
    //         year: "numeric",
    //       })
    //       : "—"
    //   },
    // },
    // {
    //   accessorKey: "validatedBy",
    //   header: ({ column }) => (
    //     <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //       Validé par <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   ),
    //   // ✅ Ajouter cell
    //   cell: ({ row }) => <span className="badge border rounded text-dark"> {row.original.validatedBy?.fullname || "—"} </span>,
    // },
    // {
    //   accessorKey: "createdAt",
    //   header: ({ column }) => (
    //     <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //       Crée le <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   ),
    //   // ✅ Formater la date
    //   cell: ({ row }) => {
    //     const date = row.getValue("createdAt") as string
    //     return new Date(date).toLocaleDateString("fr-FR", {
    //       day: "2-digit",
    //       month: "2-digit",
    //       year: "numeric",
    //     })
    //   },
    // },
    // {
    //   accessorKey: "createdBy",
    //   header: ({ column }) => (
    //     <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //       Crée par <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   ),
    //   // ✅ Ajouter cell
    //   cell: ({ row }) => <span className="badge border rounded text-dark"> {row.original.createdBy?.fullname || "—"} </span>,
    // },
  ]
}