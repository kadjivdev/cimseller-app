// app/components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown,MoreHorizontal, PencilLine} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenu,
} from "@/components/ui/dropdown-menu"

export type Vente = {
  id: number
  produit: {
    id: Number,
    name: String,
  }
  programmation: {
    id: Number,
    code: String,
  }
  commandeClient: {
    id: Number,
    code: String,
    client:{
      id: Number,
      raison_sociale: String,
    }
  }
  client: {
    id: Number,
    raison_sociale: String,
  }
  type: {
    id: Number,
    name: String,
  }
  statut: {
    id: Number,
    name: String,
  }
  typeFactureVente: {
    id: Number,
    name: String,
  }
  camion: {
    id: Number,
    immatriculation: String,
    libelle: String,
  }
  validatedBy: {
    id: Number,
    fullname: String,
  }
  createdBy: {
    id: Number,
    fullname: String,
  }

  code :         string   
  date:          string
  montant  :     number
  unitePrice:    number
  qteTotal :     number
  remise   :     number
  transport :    number
  destination  : String
  observation  : String
  preuve   :string
  
  reglemented: Boolean
  createdAt: string
  validatedAt: string

  venteComptability:{
    // comptabilité
    sender: {
      fullname: String,
    },
    treatedAt:string,
    comptabilizedAt: string
  }

}

export function useColumns(setOpen:any,setSelectedVente:any)
  : ColumnDef<Vente>[] {
  // verifier si le user a cette permission
  // const isUserPermitted = (name:String) => {
  //   return (rolePermissions).some(per => per.name == name);
  // }

  const onEdit = (vente:any)=>{
    setOpen(true)
    setSelectedVente(vente)
  }

  return [
    
    // 
    {
      id: "actions",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Actions <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const vente = row.original
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
                    className="bg-info text-white"
                    onSelect={(e) => {
                      e.preventDefault()
                      onEdit(vente) // 👈 remonte juste de la vente
                    }}
                  >
                    <PencilLine /> Traiter la vente
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
      cell: ({ row }) => <span className="badge border text-light bg-dark">{row.getValue("code") || "—"}</span>,
    },
    {
      accessorKey: "sender",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Envoyé par <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border rounded text-dark"> {row.original.venteComptability?.sender?.fullname || "—"} </span>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Envoyé le <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Formater la date
      cell: ({ row }) => {
        const date = row.original?.venteComptability?.comptabilizedAt as string
        return new Date(date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      },
    },
    {
      accessorKey: "treatedAt",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Traitée le <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Formater la date
      cell: ({ row }) => {
        const date = row.original?.venteComptability?.treatedAt as string
        let dataDate = new Date(date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })

        return <span className={`badge text-white bg-${date?'success':'danger'}`}>{date?dataDate:'Non traitée'}</span>
      },
    },
    {
      accessorKey: "produit",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Produit <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{`${row.original?.produit?.name}` || "—"}</span>,
    },
    {
      accessorKey: "commande_client",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Client <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{row.original?.client?.raison_sociale || "—"}</span>,
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
        const date = row.original?.date
        return date
          ? new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          : "--"
      }
    },
    {
      accessorKey: "unitePrice",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prix unitaire <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.unitePrice ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
    {
      accessorKey: "qteTotal",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
         Quantité totale<ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.qteTotal ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
    {
      accessorKey: "remise",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
         Remise <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.remise ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
    {
      accessorKey: "transport",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
         Transport <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.transport ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
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
      accessorKey: "type_facture",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Type facture <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{`${row.original?.typeFactureVente?.name}` || "—"}</span>,
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
  ]
}