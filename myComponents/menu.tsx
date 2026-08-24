import { Accessibility, BaggageClaim, BanknoteArrowDown, BanknoteArrowUp, Bold, BookIcon, CalendarCheck2, ChevronRightIcon, CircleArrowOutUpRight, CircleCheckBig, CircleDotDashed, Download, FileIcon, FileText, FolderIcon, FolderPlus, HandCoins, HatGlasses, KeyRound, Landmark, LayoutDashboardIcon, ListTree, Lock, MapPinHouse, PackageSearch, PencilLine, ReceiptText, ShoppingCart, SquareMenu, Tally4, TruckElectric, Users, Van } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import routes from "@/app/routes"
import { useEffect, useState } from "react"
import { useApp } from "@/app/AppContext"
// import NavLink from "@/components/NavLink"
import Link from "next/link"

type FileTreeItem = { name: string, url: String, icon: Object } | { name: string; items: FileTreeItem[] }

export function Menu() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    return JSON.parse(localStorage.getItem("menu-open") || "{}");
  });

  const {user} = useApp()

  console.log("Menu user :",user)

  const isPermittedTo = (name:string)=>{
    return user?.role?.permissions?.some((pr:any)=>pr.name==name)
  }

  useEffect(() => {
    localStorage.setItem("menu-open", JSON.stringify(openItems));
  }, [openItems]);

  const fileTree: FileTreeItem[] = [
    // dashboard
    {
      name: "DASHBOARD",
      items: [
        {
          name: "Tableau de bord",
          url: routes.dashboard,
          icon: <LayoutDashboardIcon />,
        },
      ],
    },

    // Nav d'entrées
  ...(isPermittedTo('commande.view') ? 
    [
      {
        name: "ENTREES",
        items: [
          isPermittedTo("commande.view") && {
            name: "Bon de commande",
            url: routes.bonCommande.list,
            icon: <BaggageClaim />,
            items: [
              isPermittedTo("commande.create") && { name: "Create", url: routes.bonCommande.create, icon: <FolderPlus /> },
              isPermittedTo("commande.view") && { name: "Liste", url: routes.bonCommande.list, icon: <ListTree /> },
              isPermittedTo("reçu.view") && { name: "Reçus", url: routes.bonCommande.recu, icon: <ReceiptText /> },
              isPermittedTo("accuse.view") && { name: "Accuses", url: routes.bonCommande.accuse, icon: <FileText /> }
            ].filter(Boolean)
          },
          isPermittedTo("programmation.view") &&
          {
            name: "Programmations",
            url: routes.programmation.list,
            icon: <Van />,
            items: [
              { name: "Liste", icon: <ListTree />, url: routes.programmation.list }
            ]
          }
        ].filter(Boolean),
      },
    ] : []),
    
    // Nav de sorties
    ...((isPermittedTo('suiviSortie.view') || isPermittedTo('livraison.view') || isPermittedTo('livraison.view'))?
  [
    {
      name: "SORTIES",
      items: [
        isPermittedTo('suiviSortie.view') && {
          name: "Suivi sorties",
          url: routes.suiviSortie.list,
          icon: <Accessibility />,
          items: [
            isPermittedTo('suiviSortie.view') && {
              name: "Liste",
              icon: <ListTree />,
              url: routes.suiviSortie.list,
            }
          ].filter(Boolean)
        },
        isPermittedTo('suiviChauffeur.view') && {
          name: "Suivi chauffeurs",
          url: routes.suiviChauffeur.list,
          icon: <CircleArrowOutUpRight />,
          items: [
            isPermittedTo('suiviChauffeur.view') && {
              name: "Liste",
              icon: <ListTree />,
              url: routes.suiviChauffeur.list,
            }
          ].filter(Boolean)
        },
        isPermittedTo('livraison.view') && {
          name: "Livraisons",
          url: routes.livraison.list,
          icon: <TruckElectric />,
          items: [
            isPermittedTo('livraison.view') && {
              name: "Liste",
              icon: <ListTree />,
              url: routes.livraison.list,
            }
          ].filter(Boolean)
        },
      ].filter(Boolean),
    },
  ]:[]),

    // nav de ventes
  ...(isPermittedTo('vente.view')? [
    {
        name: "VENTES",
        url: routes.vente.list,
          icon: <ShoppingCart />,
          items: [
            {
              name: "Liste",
              url: routes.vente.list,
              icon: <ListTree />,
            },
            {
              name: "En attente",
              url: routes.vente.enAttente,
              icon: <CircleDotDashed />,
            },
            {
              name: "Journalières",
              url: routes.vente.journalier,
              icon: <CalendarCheck2 />,
            },
            isPermittedTo('comptabilizedVente.view') && {
              name: "A comptabiliser",
              url: routes.vente.aComptabiliser,
              icon: <HandCoins />,
            }
          ].filter(Boolean),
      },
  ]:[]),  

    // nav de comptabilite
    ...(isPermittedTo('comptabilite.view')? [
      {
        name: "COMPTABILITE",
        items: [
          {
            name: "Liste ventes",
            url: routes.comptabilite.list,
            icon: <ListTree />,
          },
          {
            name: "A traiter",
            url: routes.comptabilite.aTraiter,
            icon: <PencilLine />,
          },
          {
            name: "Exporter ventes ",
            url: routes.comptabilite.traiter,
            icon: <Download />,
          },
        ]
      },
    ]:[]),

    // nav de soldes
    ...((isPermittedTo('approvisionnement.view') || isPermittedTo('reglement.view'))?[
      {
        name: "SOLDES",
        items: [
          isPermittedTo('approvisionnement.view') && {
            name: "Approvisionnements",
            url: routes.approvisionnement.list,
            icon: <BanknoteArrowUp />,
            items: [
              isPermittedTo('approvisionnement.create') && {
                name: "Create",
                url: routes.approvisionnement.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('approvisionnement.view') && {
                name: "Liste",
                url: routes.approvisionnement.list,
                icon: <ListTree />,
              }
            ].filter(Boolean)
          },
          isPermittedTo('reglement.view') && {
            name: "Reglements",
            url: routes.reglement.list,
            icon: <BanknoteArrowDown />,
            items: [
              isPermittedTo('reglement.create') && {
                name: "Create",
                url: routes.reglement.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('reglement.view') && {
                name: "Liste",
                url: routes.reglement.list,
                icon: <ListTree />,
              }
            ].filter(Boolean)
          },
        ].filter(Boolean),
      },
    ]:[]),

    // nav de clients
    ...(isPermittedTo('client.view') ? [
      {
        name: "CLIENTS",
        items: [
          isPermittedTo('client.create') && {
            name: "Create",
            url: routes.client.create,
            icon: <FolderPlus />,
          },
          {
            name: "Liste",
            url: routes.client.list,
            icon: <Users />,
          },
          {
            name: "Actifs",
            url: routes.client.actif,
            icon: <CircleCheckBig />,
          },
          {
            name: "Inactifs",
            url: routes.client.inactif,
            icon: <ListTree />,
          },
          {
            name: "Befs",
            url: routes.client.bef,
            icon: <KeyRound />,
          }
        ].filter(Boolean),
      },
    ]:[]),

    // nav de settings
    ...((isPermittedTo('fournisseur.view') || 
    isPermittedTo('avaliseur.view') || isPermittedTo('camion.view') ||
  isPermittedTo('chauffeur.view') || isPermittedTo('agent.view') || 
isPermittedTo('banque.view') || isPermittedTo('compteBancaire.view') ||
isPermittedTo('produit.view') || isPermittedTo('representant.view') ||
isPermittedTo('zone.view'))?[
      {
        name: "PARAMETRES",
        items: [
          isPermittedTo('fournisseur.view') && {
            name: "Fournisseurs",
            url: routes.fournisseur.list,
            icon: <Tally4 />,
            items: [
              isPermittedTo('fournisseur.create') && {
                name: "Create",
                url: routes.fournisseur.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('fournisseur.view') && {
                name: "Liste",
                url: routes.fournisseur.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          },
          isPermittedTo('avaliseur.view') && {
            name: "Avaliseurs",
            url: routes.avaliseur.list,
            icon: <Users />,
            items: [
              isPermittedTo('avaliseur.create') && {
                name: "Create",
                url: routes.avaliseur.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('avaliseur.view') && {
                name: "Liste",
                url: routes.avaliseur.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          },
          isPermittedTo('camion.view') && {
            name: "Camions",
            url: routes.camion.list,
            icon: <Van />,
            items: [
              isPermittedTo('camion.view') && {
                name: "Create",
                url: routes.camion.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('camion.view') && {
                name: "Liste",
                url: routes.camion.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          },
          isPermittedTo('chauffeur.view') && {
            name: "Chauffeurs",
            url: routes.chauffeur.list,
            icon: <Users />,
            items: [
              isPermittedTo('chauffeur.view') && {
                name: "Create",
                url: routes.chauffeur.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('chauffeur.view') && {
                name: "Liste",
                url: routes.chauffeur.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          },
          isPermittedTo('agent.view') && {
            name: "Agents",
            url: routes.agent.list,
            icon: <HatGlasses />,
            items: [
              isPermittedTo('agent.create') && {
                name: "Create",
                url: routes.agent.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('agent.view') && {
                name: "Liste",
                url: routes.agent.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          },
          isPermittedTo('banque.view') && {
            name: "Banques",
            url: routes.banque.list,
            icon: <Landmark />,
            items: [
              isPermittedTo('banque.view') && {
                name: "Create",
                url: routes.banque.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('banque.view') && {
                name: "Liste",
                url: routes.banque.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          },
          isPermittedTo('compteBancaire.view') && {
            name: "Compte Bancaires",
            url: routes.compteBancaire.list,
            icon: <Landmark />,
            items: [
              isPermittedTo('compteBancaire.create') && {
                name: "Create",
                url: routes.compteBancaire.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('compteBancaire.view') && {
                name: "Liste",
                url: routes.compteBancaire.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          },
          isPermittedTo('produit.view') && {
            name: "Produits",
            url: routes.produit.list,
            icon: <PackageSearch />,
            items: [
              isPermittedTo('produit.create') && {
                name: "Create",
                url: routes.produit.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('produit.view') && {
                name: "Liste",
                url: routes.produit.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          },
          isPermittedTo('representant.view') && {
            name: "Representants",
            url: routes.representant.list,
            icon: <MapPinHouse />,
            items: [
              isPermittedTo('representant.create') && {
                name: "Create",
                url: routes.representant.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('representant.view') && {
                name: "Liste",
                url: routes.representant.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          },
          isPermittedTo('zone.view') && {
            name: "Zones",
            url: routes.zone.list,
            icon: <MapPinHouse />,
            items: [
              isPermittedTo('zone.create') && {
                name: "Create",
                url: routes.zone.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('zone.view') && {
                name: "Liste",
                url: routes.zone.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          },
        ].filter(Boolean)
      },
    ]:[]),

    // nav de security
    ...((isPermittedTo('user.view') || isPermittedTo('role.view') || isPermittedTo('permission.view'))?[
      {
        name: "SECURITE",
        items: [
          isPermittedTo('user.view') && {
            name: "Utilisateurs",
            url: routes.user.list,
            icon: <Users />,
            items: [
              isPermittedTo('user.create') && {
                name: "Create",
                url: routes.user.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('user.view') && {
                name: "Liste",
                url: routes.user.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          },
          isPermittedTo('role.view') &&{
            name: "Rôles",
            url: routes.role.list,
            icon: <Lock />,
            items: [
              isPermittedTo('role.view') && {
                name: "Create",
                url: routes.role.create,
                icon: <FolderPlus />,
              },
              isPermittedTo('role.view') && {
                name: "Liste",
                url: routes.role.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          },
          isPermittedTo('permission.view') && {
            name: "Permissions",
            url: routes.permission.list,
            icon: <KeyRound />,
            items: [
              isPermittedTo('permission.view') && {
                name: "Liste",
                url: routes.permission.list,
                icon: <ListTree />,
              },
            ].filter(Boolean)
          }
        ].filter(Boolean)
      }
    ]:[])
  ]

  const renderItem = (fileItem: FileTreeItem) => {
    if ("items" in fileItem) {
      return (
        <Collapsible
          key={fileItem.name}
          open={openItems[fileItem.name]}
          onOpenChange={(open) =>
            setOpenItems((prev) => ({
              ...prev,
              [fileItem.name]: open,
            }))
          }>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="group rounded w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
              <FolderIcon />
              {fileItem.name}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 ml-5 style-lyra:ml-4">
            <div className="flex flex-col gap-1">
              {fileItem.items.map((child) => renderItem(child))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )
    }
    return (
      <Link
        key={fileItem.name}
        href={fileItem.url as string}
        className="w-full justify-start gap-2 text-foreground d-flex text-dark"
      >
        <small className="text-xm" style={{ fontSize: 10 }}> {fileItem.icon as string}</small>
        <span>{fileItem.name}</span>
      </Link>
    )
  }

  return (
    <Card className="gap-2 overflow-y-auto max-h-[90vh]" size="sm">
      <CardHeader>
        <Tabs defaultValue="explorer">
          <TabsList className="w-full">
            <TabsTrigger value="explorer"><SquareMenu /> Menu</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {fileTree.map((item) => renderItem(item))}
        </div>
      </CardContent>
    </Card>
  )
}
