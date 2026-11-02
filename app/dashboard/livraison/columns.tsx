// app/components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowRight, ArrowUpDown, CircleCheckBig, DoorClosed, DoorOpen, Eye, FileText, MoreHorizontal, VanIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenu,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useApp } from "@/app/AppContext"

export type Programmation = {
  id: number
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
  dateSortie: String
  dateLivraison: String
  dateProgrammation: string
  qteProgrammer: Number
  qteLivre: Number
  qteVendue: Number
  stock: Number
  bl: string
  preuve: String
  imprimer: Boolean
  closed: Boolean
  transfert:Boolean
  livraisonComment: String
  date: String
  createdAt: string
  validatedAt: string
}

export function useColumns(
  onDelivery: (programmation: Programmation) => void,
  onTransfer: (programmation: Programmation) => void,
  onClose: (programmation: Programmation) => void)
  : ColumnDef<Programmation>[] {
  
  const { user} = useApp()
  const isPermittedTo = (name:string) => {
    return user?.role?.permissions?.some((pr:any) => pr.name == name)
  }

  return [
    {
      id: "actions",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Actions <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const programmation = row.original
        const {qteLivre,qteProgrammer} = programmation

        const showTransfert = () => {
          if(user.role?.id == 5) return false; // les vendeurs ne doivent pas transferer les bons

          if ((Number(qteLivre) === 0 || !qteLivre)) {
            return true;
          }

          if(Number(qteLivre) == Number(qteProgrammer)) return false; // si la quantité livrée est égale à la quantité programmée, ne pas afficher le transfert

          return Number(qteLivre) > 0 && Number(qteLivre) < Number(qteProgrammer) && programmation.closed
        };

        console.log("showTransfert", showTransfert(), programmation.closed, user.role?.id!=5)

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

              {/* livrer le bon */}
              {isPermittedTo("programmation.edit") &&
              <>
                {!programmation.closed && 
                  <DropdownMenuItem
                    style={{ cursor: "pointer" }}
                    className="text-success"
                    onSelect={(e) => {
                      e.preventDefault()
                      onDelivery(programmation) // 👈 remonte juste du bon
                    }}
                  >
                    {(programmation.qteLivre> programmation.qteProgrammer || programmation.qteLivre== programmation.qteProgrammer)?
                    <span className=""><Eye /> Détail livraison</span> :<span className=""><VanIcon /> Livrer</span> 
                  }</DropdownMenuItem>
                }

                {/* transferer le bon  */}
                {showTransfert() &&
                <DropdownMenuItem
                    style={{ cursor: "pointer" }}
                    className="text-warning"
                    onSelect={(e) => {
                      e.preventDefault()
                      onTransfer(programmation) // 👈 remonte juste du bon
                    }}
                  >
                    {
                      programmation?.transfert?
                      <><Eye /> Voir le transfert </>:
                      <><ArrowRight /> Transferer </>
                    }
                </DropdownMenuItem>
                }

                {/* cloture le bon  */}
                {Number(qteLivre)>0 && user.role?.id==5 && !programmation.closed && // seuls les vendeurs peuvent cloturer les bons
                <DropdownMenuItem
                    style={{ cursor: "pointer" }}
                    className="text-warning"
                    onSelect={(e) => {
                      e.preventDefault()
                      onClose(programmation) // 👈 remonte juste du bon
                    }}
                  >
                    {
                      <><DoorClosed /> Clôturer </>
                    }
                </DropdownMenuItem>
                }
              </>
            }
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          N° <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        return row.index + 1
      },
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Code <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{row.getValue("code") || "—"}</span>,
    },
    {
      accessorKey: "dateSortie",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date sortie <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        const date = row.original?.dateSortie
        return date
          ? new Date(date as string).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          : "--"
      }
    },
    {
      accessorKey: "camion",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Camion <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{`${row.original?.camion?.immatriculation}` || "—"}</span>,
    },
    {
      accessorKey: "chauffeur",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Chauffeur <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{`${row.original?.chauffeur?.fullname}` || "—"}</span>,
    },
    {
      accessorKey: "avaliseur",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Avaliseur <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{`${row.original?.avaliseur?.fullname}` || "—"}</span>,
    },
    {
      accessorKey: "qteprogrammer",
      header: ({ column }) => (
        <Button className="w-100 bg-info text-light rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Quantité Programmée <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-info text-light border"> {(row.original.qteProgrammer ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
    {
      accessorKey: "qteLivre",
      header: ({ column }) => (
        <Button className="w-100 bg-success text-light rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Quantité Livrée <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-success"> {(row.original.qteLivre ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
    {
      accessorKey: "qteVendue",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Quantité Vendue <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-light border text-dark"> {(row.original.qteVendue ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <Button className="w-100 bg-danger text-light rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Stock Camion <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge bg-danger border text-light shadow border-dark"> {(row.original.stock ?? 0)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || "—"} </span>,
    },
    {
      accessorKey: "dateLivraison",
      header: ({ column }) => (
        <Button className="w-100 bg-dark text-light rounded" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date Livraison <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        const date = row.original?.dateLivraison
        return date
          ? <span className="badge shadow-sm bg-light text-dark border rounded">
            {
              new Date(date as string).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            }
          </span>
          : "--"
      }
    },
    {
      accessorKey: "livraisonComment",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Commentaire <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <Textarea rows={1} className="field-sizing-fixed h-10 min-h-0 resize-none" placeholder={row.getValue("livraisonComment") || '---'} />,
    },
    {
      accessorKey: "zone",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Zone <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => <span className="badge border text-dark">{`${row.original?.zone?.name}` || "—"}</span>,
    },
    {
      accessorKey: "bl",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Bl <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {

        return (
          <>
            <span className="badge bg-light border text-dark"> {row.original?.bl || "—"} </span> <br />
            <span className="badge shadow-sm rounded border text-dark">{row.original?.preuve && <Link target="_blank" href={row.original?.preuve as string}><FileText className="text-dark" /> </Link>}</span>
          </>
          )
      }
    },
    {
      accessorKey: "closed",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Clôturée <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // ✅ Ajouter cell
      cell: ({ row }) => {
        let closed = row.original?.closed
        let icon = closed? <DoorClosed/>: <DoorOpen/>;
        let classText = closed? 'bg-success': 'bg-dark';
        
        return <>
          <span className={`flex items-center gap-1 whitespace-nowrap badge border ${classText}`}>
            <span className="[&>svg]:size-3">{icon}</span>
          </span>
          {row.original?.closed ?
            <span className="flex badge bg-success text-white">
            Clôturée
          </span>:
          <span className="flex badge bg-light text-dark">
            Non Clôturée
          </span>
          }
        </>
      }
    },
    {
      accessorKey: "statut",
      header: ({ column }) => (
        <Button className="w-100 rounded border shadow-sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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
          case 3:
            classText = 'bg-warning text-white'//partiellement livrée
            statutText = row.original?.statut?.name
            icon = <CircleCheckBig />
            break;
          case 4:
            classText = 'bg-success text-white'//livrée
            statutText = row.original?.statut?.name
            icon = <CircleCheckBig />
            break;
          default:
            classText = 'bg-dark text-white'//validée
            statutText = 'Non livrée'
            icon = <X />
            break;
        }
        return <>
          <span className={`flex items-center gap-1 whitespace-nowrap badge border ${classText}`}>
            <span className="[&>svg]:size-3">{icon}</span> {statutText || "—"}
          </span>
          {row.original?.transfert && 
            <span className="flex badge bg-success text-white">
            Transféré
          </span>
          }
        </>
      }
    },
  ]
}