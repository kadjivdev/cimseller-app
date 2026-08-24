// app/components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle, CircleCheckBig, CircleX, Van, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
export type Programmation = {
  id: number
  statut: {
    id: Number,
    name: String,
  }
  commande: {
    id: Number,
    code: String,
    fournisseur: {
      id: Number,
      sigle: String,
      raison_sociale: String
    }
    commandeDetails: [
      {
        id: Number,
        product: {
          id: Number,
          name: String,
        }
      }
    ]
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
  ventes: [
    {
      id: Number,
      code: String
      date: String
      montant: Number
      qteTotal:Number
      commandeClient: {
        id: Number,
        client: {
          id: Number
          raison_sociale: String
        }
      }
      client: {
        id: Number
        raison_sociale: String
      }
    }
  ]
  code: string
  dateSortie: string
  dateProgrammation: string
  qteProgrammer: Number
  qteLivre: Number
  qteVendue: Number
  bl: string
  imprimer: Boolean
  observation: String
  date: String
  createdAt: string
  validatedAt: string
  validatedById:Number
}

export function useColumns()
  : ColumnDef<Programmation>[] {
 

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
      cell: ({ row }) => <span className="badge bg-light shadow-sm border text-dark">{row.getValue("code") || "—"}</span>,
    },
    {
      accessorKey: "datesortie",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date sortie <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        const date = row.original?.dateSortie
        return date
          ? <span className="badge shadow-sm text-dark border">
            {new Date(date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
          : "--"
      }
    },
    {
      accessorKey: "commande",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Bon de commande <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="bg-dark shadow-sm badge border text-white">{`${row.original?.commande?.code}` || "—"}</span>,
    },
    {
      id: "fournisseur", // requis quand on n'a pas d'accessorKey
      accessorFn: (row) => row.commande?.fournisseur?.sigle || "",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Fournisseur <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const fournisseur = row.original?.commande?.fournisseur
        const label = fournisseur ? `${fournisseur.sigle}-${fournisseur.raison_sociale}` : "—"
        return <span className="badge border text-dark">{label}</span>
      },
    },
    {
      id: "product", // requis quand on n'a pas d'accessorKey
      accessorFn: (row) => row.commande?.fournisseur?.sigle || "",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Produit <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const detail = row.original?.commande?.commandeDetails?.[0]
        return <span className="badge border text-dark">{detail.product?.name}</span>
      },
    },
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
    {
      accessorKey: "qteVendue",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Quantité Vendue <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.qteVendue ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
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
    {
      accessorKey: "bl",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Bl <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {row.original?.bl || "—"} </span>,
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
        let statut = row.original?.statut
        let classText = ''
        let statutText = null
        let icon;
        switch (statut?.id) {
          case 1 || row.original?.validatedById:
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
    {
      accessorKey: "imprimer",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Imprimée <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className={`[&>svg]:size-3 btn btn-sm ${row.original?.imprimer ? 'bg-dark text-white' : 'bg-danger text-white'}`}>{row.original?.imprimer ? <CheckCircle /> : <X />}</span>
    },
    {
      accessorKey: "observation",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Observation <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <Textarea placeholder={row.getValue("observation")} />,
    },
    {
      accessorKey: "vente",
      header: ({ column }) => (
        <Button className="w-100 rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Client - Destination <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        const programmation = row.original

        return (
            <div className="d-flex flex-wrap gap-1">
                {programmation?.ventes?.map((vente) => {
                    const text = `Client: ${vente?.commandeClient?.client?.raison_sociale} | Vente: ${vente?.code} | Qte Vendue: ${vente.qteTotal}`
                    return (
                        <span key={vente.id as number} className="badge rounded border text-dark">
                            {text}
                        </span>
                    )
                })}
            </div>
        )
    },
  }
  ]
}