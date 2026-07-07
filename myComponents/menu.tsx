import { Accessibility, BaggageClaim, BanknoteArrowDown, BanknoteArrowUp, CalendarCheck2, ChevronRightIcon, CircleArrowOutUpRight, Download, FileIcon, FolderIcon, FolderPlus, HandCoins, HatGlasses, KeyRound, Landmark, LayoutDashboardIcon, ListTree, Lock, MapPinHouse, PackageSearch, PencilLine, ShoppingCart, SquareMenu, Tally4, TruckElectric, Users, Van } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import routes from "@/app/routes"
import Link from "next/link"
import { useEffect, useState } from "react"

type FileTreeItem = { name: string, url: String, icon: Object } | { name: string; items: FileTreeItem[] }

export function Menu() {
  // const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [openItems, setOpenItems] = useState(() => {
    if (typeof window === "undefined") return {};
    return JSON.parse(localStorage.getItem("menu-open") || "{}");
  });

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
          items: [
            {
              name: "button.tsx",
              url: routes.dashboard,
              icon: <LayoutDashboardIcon />,
            },
          ],
        },
      ],
    },

    // Nav d'entrées
    {
      name: "ENTREES",
      items: [
        {
          name: "Bon de commande",
          url: routes.bonCommande.list,
          icon: <BaggageClaim />,
          items: [
            {
              name: "Create",
              url: routes.bonCommande.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.bonCommande.list,
              icon: <ListTree />,
            }
          ]
        },
        {
          name: "Programmations",
          url: routes.programmation.list,
          icon: <Van />,
          items: [
            {
              name: "Create",
              icon: <FolderPlus />,
              url: routes.programmation.create,
            },
            {
              name: "Liste",
              icon: <ListTree />,
              url: routes.programmation.list,
            }
          ]
        }
      ],
    },

    // Nav de sorties
    {
      name: "SORTIES",
      items: [
        {
          name: "Livraisons",
          url: routes.livraison.list,
          icon: <TruckElectric />,
          items: [
            {
              name: "Create",
              icon: <FolderPlus />,
              url: routes.livraison.create,
            },
            {
              name: "Liste",
              icon: <ListTree />,
              url: routes.livraison.list,
            }
          ]
        },
        {
          name: "Suivi sorties",
          url: routes.suiviSortie.list,
          icon: <Accessibility />,
          items: [
            {
              name: "Liste",
              icon: <ListTree />,
              url: routes.suiviSortie.list,
            }
          ]
        },
        {
          name: "Suivi chauffeurs",
          url: routes.suiviChauffeur.list,
          icon: <CircleArrowOutUpRight />,
          items: [
            {
              name: "Liste",
              icon: <ListTree />,
              url: routes.suiviChauffeur.list,
            }
          ]
        }
      ],
    },

    // nav de ventes
    {
      name: "VENTES",
      items: [
        {
          name: "Ventes",
          url: routes.vente.list,
          icon: <ShoppingCart />,
          items: [
            {
              name: "Create",
              url: routes.vente.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.vente.list,
              icon: <ListTree />,
            },
            {
              name: "Journalières",
              url: routes.vente.journalier,
              icon: <CalendarCheck2 />,
            },
            {
              name: "A modifier",
              url: routes.vente.aModifier,
              icon: <PencilLine />,
            },
            {
              name: "A comptabiliser",
              url: routes.vente.aComptabiliser,
              icon: <HandCoins />,
            }
          ]
        },
      ],
    },

    // nav de comptabilite
    {
      name: "COMPTABILITE",
      items: [
        // nav de comptabilites
        {
          name: "Comptabilités",
          url: routes.comptabilite.list,
          icon: <HandCoins />,
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
              url: routes.comptabilite.exporter,
              icon: <Download />,
            },
          ]
        },
      ]
    },

    // nav de soldes
    {
      name: "SOLDES",
      items: [
        {
          name: "Approvisionnements",
          url: routes.approvisionnement.list,
          icon: <BanknoteArrowUp />,
          items: [
            {
              name: "Create",
              url: routes.approvisionnement.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.approvisionnement.list,
              icon: <ListTree />,
            }
          ]
        },
        {
          name: "Reglements",
          url: routes.reglement.list,
          icon: <BanknoteArrowDown />,
          items: [
            {
              name: "Create",
              url: routes.reglement.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.reglement.list,
              icon: <ListTree />,
            }
          ]
        },
      ],
    },

    // nav de clients
    {
      name: "CLIENTS",
      items: [
        {
          name: "Clients",
          url: routes.client.list,
          icon: <Users />,
          items: [
            {
              name: "Create",
              url: routes.client.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.client.list,
              icon: <ListTree />,
            },
            {
              name: "Actifs",
              url: routes.client.actif,
              icon: <ListTree />,
            },
            {
              name: "Inactifs",
              url: routes.client.inactif,
              icon: <ListTree />,
            },
            {
              name: "Befs",
              url: routes.client.bef,
              icon: <ListTree />,
            }
          ]
        },
      ],
    },

    // nav de settings
    {
      name: "PARAMETRES",
      items: [
        {
          name: "Fournisseurs",
          url: routes.fournisseur.list,
          icon: <Tally4 />,
          items: [
            {
              name: "Create",
              url: routes.fournisseur.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.fournisseur.list,
              icon: <ListTree />,
            },
          ]
        },
        {
          name: "Avaliseurs",
          url: routes.avaliseur.list,
          icon: <Users />,
          items: [
            {
              name: "Create",
              url: routes.avaliseur.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.avaliseur.list,
              icon: <ListTree />,
            },
          ]
        },
        {
          name: "Camions",
          url: routes.camion.list,
          icon: <Van />,
          items: [
            {
              name: "Create",
              url: routes.camion.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.camion.list,
              icon: <ListTree />,
            },
          ]
        },
        {
          name: "Chauffeurs",
          url: routes.chauffeur.list,
          icon: <Users />,
          items: [
            {
              name: "Create",
              url: routes.chauffeur.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.chauffeur.list,
              icon: <ListTree />,
            },
          ]
        },
        {
          name: "Agents",
          url: routes.agent.list,
          icon: <HatGlasses />,
          items: [
            {
              name: "Create",
              url: routes.agent.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.agent.list,
              icon: <ListTree />,
            },
          ]
        },
        {
          name: "Banques",
          url: routes.banque.list,
          icon: <Landmark />,
          items: [
            {
              name: "Create",
              url: routes.banque.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.banque.list,
              icon: <ListTree />,
            },
          ]
        },
        {
          name: "Produits",
          url: routes.produit.list,
          icon: <PackageSearch />,
          items: [
            {
              name: "Create",
              url: routes.produit.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.produit.list,
              icon: <ListTree />,
            },
          ]
        },
        {
          name: "Representants",
          url: routes.representant.list,
          icon: <MapPinHouse />,
          items: [
            {
              name: "Create",
              url: routes.representant.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.representant.list,
              icon: <ListTree />,
            },
          ]
        },
        {
          name: "Zones",
          url: routes.zone.list,
          icon: <MapPinHouse />,
          items: [
            {
              name: "Create",
              url: routes.zone.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.zone.list,
              icon: <ListTree />,
            },
          ]
        },

      ]
    },

    // nav de security
    {
      name: "SECURITE",
      items: [
        {
          name: "Utilisateurs",
          url: routes.user.list,
          icon: <Users />,
          items: [
            {
              name: "Create",
              url: routes.user.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.user.list,
              icon: <ListTree />,
            },
          ]
        },
        {
          name: "Rôles",
          url: routes.role.list,
          icon: <Lock />,
          items: [
            {
              name: "Create",
              url: routes.role.create,
              icon: <FolderPlus />,
            },
            {
              name: "Liste",
              url: routes.role.list,
              icon: <ListTree />,
            },
          ]
        },
        {
          name: "Permissions",
          url: routes.permission.list,
          icon: <KeyRound />,
          items: [
            {
              name: "Liste",
              url: routes.permission.list,
              icon: <ListTree />,
            },
          ]
        }
      ]
    }
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
              className="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
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
        variant="link"
        href={fileItem.url}
        size="sm"
        className="w-full justify-start gap-2 text-foreground d-flex text-dark"
      >
        <small className="text-xm" style={{ fontSize: 10 }}> {fileItem.icon}</small>
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
