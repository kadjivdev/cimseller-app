"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, BaggageClaim, Van, ListTree, TruckElectric, Accessibility, CircleArrowOutUpRight, Car, ShoppingCart, CalendarCheck2, PencilLine, HandCoins, BanknoteArrowUp, BanknoteArrowDown, Users, Users2, Landmark, PackageSearch, MapPinHouse, Tally4, HatGlasses, Download, Lock, KeyRound, FolderPlus } from "lucide-react"
import { Separator } from "./ui/separator"
import routes from "@/app/routes"
import { useRouter } from "next/navigation"
import { Menu } from "@/myComponents/menu"

const data = {
  user: {
    name: "kADJIV",
    email: "kadjivsarl1@gmail.com",
    avatar: "../app/favicon.ico",
  },

  navs: [
    // Nav dashboard
    {
      title: "DASHBOARD",
      menus: [
        {
          id: 1,
          title: "Tableau de board",
          url: routes.dashboard,
          icon: <LayoutDashboardIcon />,
          active: true
        },
      ]
    },

    // Nav d'entrées
    {
      title: "ENTREES",
      menus: [
        {
          id: 1,
          title: "Bon de commande",
          url: routes.bonCommande.list,
          icon: <BaggageClaim />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.bonCommande.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.bonCommande.list,
              icon: <ListTree />,
              active: false
            }
          ]
        },
        {
          id: 2,
          title: "Programmations",
          url: routes.programmation.list,
          icon: <Van />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              icon: <FolderPlus />,
              url: routes.programmation.create,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              icon: <ListTree />,
              url: routes.programmation.list,
              active: false
            }
          ]
        }
      ],
    },

    // Nav de sorties
    {
      title: "SORTIES",
      menus: [
        {
          id: 3,
          title: "Livraisons",
          url: routes.livraison.list,
          icon: <TruckElectric />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              icon: <FolderPlus />,
              url: routes.livraison.create,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              icon: <ListTree />,
              url: routes.livraison.list,
              active: false
            }
          ]
        },
        {
          id: 4,
          title: "Suivi sorties",
          url: routes.suiviSortie.list,
          icon: <Accessibility />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Liste",
              icon: <ListTree />,
              url: routes.suiviSortie.list,
              active: false
            }
          ]
        },
        {
          id: 5,
          title: "Suivi chauffeurs",
          url: routes.suiviChauffeur.list,
          icon: <CircleArrowOutUpRight />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Liste",
              icon: <ListTree />,
              url: routes.suiviChauffeur.list,
              active: false
            }
          ]
        }
      ],
    },

    // nav de ventes
    {
      title: "VENTES",
      menus: [
        {
          id: 8,
          title: "Ventes",
          url: routes.vente.list,
          icon: <ShoppingCart />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.vente.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.vente.list,
              icon: <ListTree />,
              active: false
            },
            {
              id: 3,
              libelle: "Journalières",
              url: routes.vente.journalier,
              icon: <CalendarCheck2 />,
              active: false
            },
            {
              id: 4,
              libelle: "A modifier",
              url: routes.vente.aModifier,
              icon: <PencilLine />,
              active: false
            },
            {
              id: 5,
              libelle: "A comptabiliser",
              url: routes.vente.aComptabiliser,
              icon: <HandCoins />,
              active: false
            }
          ]
        },
      ],
    },

    // nav de comptabilite
    {
      title: "COMPTABILITE",
      menus: [
        // nav de comptabilites
        {
          id: 9,
          title: "Comptabilités",
          url: routes.comptabilite.list,
          icon: <HandCoins />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Liste ventes",
              url: routes.comptabilite.list,
              icon: <ListTree />,
              active: false
            },
            {
              id: 2,
              libelle: "A traiter",
              url: routes.comptabilite.aTraiter,
              icon: <PencilLine />,
              active: false
            },
            {
              id: 3,
              libelle: "Exporter ventes ",
              url: routes.comptabilite.exporter,
              icon: <Download />,
              active: false
            },
          ]
        },
      ]
    },

    // nav de soldes
    {
      title: "SOLDES",
      menus: [
        {
          id: 10,
          title: "Approvisionnements",
          url: routes.approvisionnement.list,
          icon: <BanknoteArrowUp />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.approvisionnement.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.approvisionnement.list,
              icon: <ListTree />,
              active: false
            }
          ]
        },
        {
          id: 11,
          title: "Reglements",
          url: routes.reglement.list,
          icon: <BanknoteArrowDown />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.reglement.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.reglement.list,
              icon: <ListTree />,
              active: false
            }
          ]
        },
      ],
    },

    // nav de clients
    {
      title: "CLIENTS",
      menus: [
        {
          id: 12,
          title: "Clients",
          url: routes.client.list,
          icon: <Users />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.client.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.client.list,
              icon: <ListTree />,
              active: false
            },
            {
              id: 3,
              libelle: "Actifs",
              url: routes.client.actif,
              icon: <ListTree />,
              active: false
            },
            {
              id: 4,
              libelle: "Inactifs",
              url: routes.client.inactif,
              icon: <ListTree />,
              active: false
            },
            {
              id: 5,
              libelle: "Befs",
              url: routes.client.bef,
              icon: <ListTree />,
              active: false
            }
          ]
        },
      ],
    },

    // nav de settings
    {
      title: "PARAMETRES",
      menus: [
        {
          id: 13,
          title: "Fournisseurs",
          url: routes.fournisseur.list,
          icon: <Tally4 />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.fournisseur.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.fournisseur.list,
              icon: <ListTree />,
              active: false
            },
          ]
        },
        {
          id: 14,
          title: "Avaliseurs",
          url: routes.avaliseur.list,
          icon: <Users />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.avaliseur.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.avaliseur.list,
              icon: <ListTree />,
              active: false
            },
          ]
        },
        {
          id: 15,
          title: "Camions",
          url: routes.camion.list,
          icon: <Van />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.camion.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.camion.list,
              icon: <ListTree />,
              active: false
            },
          ]
        },
        {
          id: 16,
          title: "Chauffeurs",
          url: routes.chauffeur.list,
          icon: <Users />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.chauffeur.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.chauffeur.list,
              icon: <ListTree />,
              active: false
            },
          ]
        },
        {
          id: 17,
          title: "Agents",
          url: routes.agent.list,
          icon: <HatGlasses />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.agent.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.agent.list,
              icon: <ListTree />,
              active: false
            },
          ]
        },
        {
          id: 18,
          title: "Banques",
          url: routes.banque.list,
          icon: <Landmark />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.banque.list,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.banque.list,
              icon: <ListTree />,
              active: false
            },
          ]
        },
        {
          id: 19,
          title: "Produits",
          url: routes.produit.list,
          icon: <PackageSearch />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.produit.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.produit.list,
              icon: <ListTree />,
              active: false
            },
          ]
        },
        {
          id: 20,
          title: "Zones",
          url: routes.zone.list,
          icon: <MapPinHouse />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.zone.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.zone.list,
              icon: <ListTree />,
              active: false
            },
          ]
        }
      ]
    },

    // nav de security
    {
      title: "SECURITE",
      menus: [
        {
          id: 21,
          title: "Utilisateurs",
          url: routes.user.list,
          icon: <Users />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.user.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.user.list,
              icon: <ListTree />,
              active: false
            },
          ]
        },
        {
          id: 22,
          title: "Rôles",
          url: routes.role.list,
          icon: <Lock />,
          active: false,
          items: [
            {
              id: 1,
              libelle: "Create",
              url: routes.role.create,
              icon: <FolderPlus />,
              active: false
            },
            {
              id: 2,
              libelle: "Liste",
              url: routes.role.list,
              icon: <ListTree />,
              active: false
            },
          ]
        },
        {
          id: 23,
          title: "Permissions",
          url: routes.permission.list,
          icon: <KeyRound />,
          active: false,
          items: [
            {
              id: 2,
              libelle: "Liste",
              url: routes.permission.list,
              icon: <ListTree />,
              active: false
            },
          ]
        }
      ]
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  return (
    <>
      <Sidebar
        collapsible="offcanvas"
        {...props}
        className="shadow-sm border" style={{ width: '50vh' }} >
        <SidebarHeader className="border-bottom rounded shadow-sm">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-0!">
                <img src="/cimseller_animated_logo.gif"
                  onClick={() => router.push(routes.dashboard)}
                  style={{ cursor: "pointer" }}
                  width={100} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {/* {data.navs.map((nav, key) => (
            <div key={key}>
              <NavMain label={nav.title} items={nav.menus} />
              <Separator />
            </div>
          ))} */}
          <Menu />
        </SidebarContent>


        <SidebarFooter className="border-top shadow-sm">
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
