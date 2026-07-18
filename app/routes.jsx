
const routes = {
  login: "/",
  dashboard: `/dashboard`,
  profil: `/dashboard/profil`,
  bonCommande: {
    list: "/dashboard/bon-commande",
    create: "/dashboard/bon-commande/create",
    recu: "/dashboard/bon-commande/recus",
    accuse: "/dashboard/bon-commande/accuses",
  },
  programmation: {
    list: "/dashboard/programmation",
    create: "/dashboard/programmation/create",
  },
  livraison: {
    list: "/dashboard/livraison",
    create: "/dashboard/livraison/create",
  },
  suiviSortie: {
    list: "/dashboard/suivi-sortie",
  },
  suiviChauffeur: {
    list: "/dashboard/suivi-chauffeur",
  },
  vente: {
    list: "/dashboard/vente",
    create: "/dashboard/vente/create",
    journalier: "/dashboard/vente/journalier",
    aModifier: "/dashboard/vente/a-modifier",
    aComptabiliser: "/dashboard/vente/a-comptabiliser",
  },
  comptabilite: {
    list: "/dashboard/comptabilite",
    aTraiter: "/dashboard/comptabilite/a-traiter",
    exporter: "/dashboard/comptabilite/create",
  },
  approvisionnement: {
    list: "/dashboard/approvisionnement",
    create: "/dashboard/approvisionnement/create",
  },
  reglement: {
    list: "/dashboard/reglement",
    create: "/dashboard/reglement/create",
  },
  client: {
    list: "/dashboard/client",
    create: "/dashboard/client/create",
    actif: "/dashboard/client/actif",
    inactif: "/dashboard/client/inactif",
    bef: "/dashboard/client/bef",
  },
  fournisseur: {
    list: "/dashboard/fournisseur",
    create: "/dashboard/fournisseur/create",
  },
  avaliseur: {
    list: "/dashboard/avaliseur",
    create: "/dashboard/avaliseur/create",
  },
  camion: {
    list: "/dashboard/camion",
    create: "/dashboard/camion/create",
  },
  chauffeur: {
    list: "/dashboard/chauffeur",
    create: "/dashboard/chauffeur/create",
  },
  agent: {
    list: "/dashboard/agent",
    create: "/dashboard/agent/create",
  },
  banque: {
    list: "/dashboard/banque",
    create: "/dashboard/banque/create",
  },
  compteBancaire: {
    list: "/dashboard/compte-bancaire",
    create: "/dashboard/compte-bancaire/create",
  },
  produit: {
    list: "/dashboard/produit",
    create: "/dashboard/produit/create",
  },
  zone: {
    list: "/dashboard/zone",
    create: "/dashboard/zone/create",
  },
  representant: {
    list: "/dashboard/representant",
    create: "/dashboard/representant/create",
  },
  user: {
    list: "/dashboard/user",
    create: "/dashboard/user/create",
  },
  role: {
    list: "/dashboard/role",
    create: "/dashboard/role/create",
  },
  permission: {
    list: "/dashboard/permission",
  },
}

export default routes