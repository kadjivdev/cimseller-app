// app/components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

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

  // comptabilité
  venteComptability:{
    sender: {
      fullname: String,
    },
    treatedAt:string,
    comptabilizedAt: string

    tva :number
    aib: number
    ttcPrice :number 
    marge: number
    usinePrixHT :number
    margePrice :number
    htPrice: number
    bruitPrice : number
    netHorsTaxe :number
    tvaPrice :number
    aibPrice : number
    prixTTC:number
  }
}

export function useColumns()
  : ColumnDef<Vente>[] {
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
      accessorKey: "tva",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          TVA <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.venteComptability?.tva ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
     {
      accessorKey: "aib",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          AIB <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.venteComptability?.aib ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
     {
      accessorKey: "ttcPrice",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prix TTC <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.venteComptability?.ttcPrice ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
     {
      accessorKey: "marge",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Marge <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.venteComptability?.marge ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
     {
      accessorKey: "usinePriceHT",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prix Usine HT <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.venteComptability?.usinePrixHT ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
     {
      accessorKey: "margePrice",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prix marge <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.venteComptability?.margePrice ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
     {
      accessorKey: "htPrice",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prix HT <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.venteComptability?.htPrice ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
     {
      accessorKey: "bruitPrice",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prix Bruite <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.venteComptability?.bruitPrice ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
     {
      accessorKey: "netHorsTaxe",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Net Hors Taxe <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.venteComptability?.netHorsTaxe ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
     {
      accessorKey: "tvaPrice",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prix TVA <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.venteComptability?.tvaPrice ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
     {
      accessorKey: "aibPrice",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prix AIB <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.venteComptability?.aibPrice ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
     {
      accessorKey: "prixTTC",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prix TTC <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.venteComptability?.prixTTC ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
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