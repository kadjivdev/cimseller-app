import { ExportColumn, formatDateFR, formatNumberFR } from "@/lib/exportHelpers"

type VenteBase = {
  id?: number
  code?: string
  date?: string
  unitePrice?: number
  qteTotal?: number
  remise?: number
  transport?: number
  montant?: number
  destination?: string
  observation?: string
  preuve?: string
  createdAt?: string
  validatedAt?: string
  produit?: { name?: string }
  client?: { raison_sociale?: string }
  commandeClient?: { code?: string; client?: { raison_sociale?: string } }
  type?: { id?: number; name?: string }
  statut?: { id?: number; name?: string }
  typeFactureVente?: { name?: string }
  validatedBy?: { fullname?: string }
  createdBy?: { fullname?: string }
}

type VenteComptability = {
  sender?: { fullname?: string }
  treatedAt?: string
  comptabilizedAt?: string
  unitPriceAib?: number
  unitPriceTva?: number
  unitPriceMarge?: number
  unitPriceTtc?: number
  priceHT?: number
  priceAib?: number
  priceTva?: number
  price118?: number
  priceMarge?: number
  priceTtc?: number
}

type VenteComptable = VenteBase & {
  venteComptability?: VenteComptability
}

const treatedAtValue = (comptability?: VenteComptability) =>
  comptability?.treatedAt ? formatDateFR(comptability.treatedAt) : "Non traitée"

export function getStandardVenteExportColumns<T extends VenteBase>(): ExportColumn<T>[] {
  return [
    { label: "N°", getValue: (r) => r.id ?? "—", key:"" },
    { label: "Code", getValue: (r) => r.code ?? "—", key:"" },
    { label: "Produit", getValue: (r) => r.produit?.name ?? "—", key:"" },
    { label: "Code Commande", getValue: (r) => r.commandeClient?.code ?? "—" , key:""},
    { label: "Commande Client", getValue: (r) => r.commandeClient?.client?.raison_sociale ?? "—", key:"" },
    { label: "Date", getValue: (r) => formatDateFR(r.date, "--"), key:"" },
    { label: "Client Payeur", getValue: (r) => r.client?.raison_sociale ?? "—", key:"" },
    { label: "Prix unitaire", getValue: (r) => formatNumberFR(r.unitePrice), key:"" },
    { label: "Quantité totale", getValue: (r) => formatNumberFR(r.qteTotal), key:"" },
    { label: "Remise", getValue: (r) => formatNumberFR(r.remise), key:"" },
    { label: "Transport", getValue: (r) => formatNumberFR(r.transport), key:"" },
    { label: "Montant", getValue: (r) => formatNumberFR(r.montant) , key:""},
    { label: "Type", getValue: (r) => r.type?.name ?? "—" , key:""},
    { label: "Type facture", getValue: (r) => r.typeFactureVente?.name ?? "—", key:"" },
    {
      label: "Statut",
      getValue: (r) => {
        if (r.statut?.id && r.statut?.name) return r.statut.name
        return "En Cours"
      },
      key:""
    },
    { label: "Preuve", getValue: (r) => r.preuve ?? "---", key:"" },
    { label: "Destination", getValue: (r) => r.destination ?? "—", key:"" },
    { label: "Observation", getValue: (r) => r.observation ?? "—", key:"" },
    { label: "Validé le", getValue: (r) => formatDateFR(r.validatedAt), key:"" },
    { label: "Validé par", getValue: (r) => r.validatedBy?.fullname ?? "—", key:"" },
    { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt), key:"" },
    { label: "Crée par", getValue: (r) => r.createdBy?.fullname ?? "—", key:"" },
  ]
}

export function getComptabilizedVenteExportColumns<T extends VenteComptable>(): ExportColumn<T>[] {
  return [
    { label: "N°", getValue: (r) => r.id ?? "—", key:"" },
    { label: "Code", getValue: (r) => r.code ?? "—", key:"" },
    { label: "Envoyé par", getValue: (r) => r.venteComptability?.sender?.fullname ?? "—", key:"" },
    { label: "Envoyé le", getValue: (r) => formatDateFR(r.venteComptability?.comptabilizedAt), key:"" },
    { label: "Traitée le", getValue: (r) => treatedAtValue(r.venteComptability), key:"" },
    { label: "Produit", getValue: (r) => r.produit?.name ?? "—" , key:""},
    { label: "Client", getValue: (r) => r.client?.raison_sociale ?? "—", key:"" },
    { label: "Date", getValue: (r) => formatDateFR(r.date, "--") , key:""},
    { label: "Prix unitaire", getValue: (r) => formatNumberFR(r.unitePrice) , key:""},
    { label: "Quantité totale", getValue: (r) => formatNumberFR(r.qteTotal) , key:""},
    { label: "Remise", getValue: (r) => formatNumberFR(r.remise) , key:""},
    { label: "Transport", getValue: (r) => formatNumberFR(r.transport) , key:""},
    { label: "Montant", getValue: (r) => formatNumberFR(r.montant), key:"" },
    { label: "AIB unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceAib), key:"" },
    { label: "TVA Unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceTva), key:"" },
    { label: "Prix 1.18", getValue: (r) => formatNumberFR(r.venteComptability?.price118), key:"" },
    { label: "Marge unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceMarge) , key:""},
    { label: "Prix TTC unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceTtc), key:"" },
    { label: "Prix HT", getValue: (r) => formatNumberFR(r.venteComptability?.priceHT), key:"" },
    { label: "Prix AIB", getValue: (r) => formatNumberFR(r.venteComptability?.priceAib), key:"" },
    { label: "Prix TVA", getValue: (r) => formatNumberFR(r.venteComptability?.priceTva), key:"" },
    { label: "Prix marge", getValue: (r) => formatNumberFR(r.venteComptability?.priceMarge), key:"" },
    { label: "Prix TTC", getValue: (r) => formatNumberFR(r.venteComptability?.priceTtc) , key:""},
    { label: "Type facture", getValue: (r) => r.typeFactureVente?.name ?? "—" , key:""},
    { label: "Crée par", getValue: (r) => r.createdBy?.fullname ?? "—" , key:""},
  ]
}

export function getTraiterVenteExportColumns<T extends VenteComptable>(): ExportColumn<T>[] {
  return [
    { label: "N°", getValue: (r) => r.id ?? "—", key:"" },
    { label: "Code", getValue: (r) => r.code ?? "—",key:"" },
    { label: "Envoyé par", getValue: (r) => r.venteComptability?.sender?.fullname ?? "—", key:"" },
    { label: "Envoyé le", getValue: (r) => formatDateFR(r.venteComptability?.comptabilizedAt), key:"" },
    { label: "Traitée le", getValue: (r) => treatedAtValue(r.venteComptability), key:"" },
    { label: "Produit", getValue: (r) => r.produit?.name ?? "—" , key:""},
    { label: "Client", getValue: (r) => r.client?.raison_sociale ?? "—", key:"" },
    { label: "Date", getValue: (r) => formatDateFR(r.date, "--"), key:"" },
    { label: "Prix unitaire", getValue: (r) => formatNumberFR(r.unitePrice), key:"" },
    { label: "Quantité totale", getValue: (r) => formatNumberFR(r.qteTotal), key:"" },
    { label: "Remise", getValue: (r) => formatNumberFR(r.remise), key:"" },
    { label: "Transport", getValue: (r) => formatNumberFR(r.transport), key:"" },
    { label: "Montant", getValue: (r) => formatNumberFR(r.montant) , key:""},
    { label: "AIB unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceAib), key:"" },
    { label: "TVA Unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceTva) , key:""},
    { label: "Marge unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceMarge) , key:""},
    { label: "Prix TTC unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceTtc) , key:""},
    { label: "Prix HT", getValue: (r) => formatNumberFR(r.venteComptability?.priceHT) , key:""},
    { label: "Prix AIB", getValue: (r) => formatNumberFR(r.venteComptability?.priceAib) , key:""},
    { label: "Prix TVA", getValue: (r) => formatNumberFR(r.venteComptability?.priceTva) , key:""},
    { label: "Prix marge", getValue: (r) => formatNumberFR(r.venteComptability?.priceMarge) , key:""},
    { label: "Prix 1.18", getValue: (r) => formatNumberFR(r.venteComptability?.price118) , key:""},
    { label: "Prix TTC", getValue: (r) => formatNumberFR(r.venteComptability?.priceTtc) , key:""},
    { label: "Type facture", getValue: (r) => r.typeFactureVente?.name ?? "—" , key:""},
    { label: "Crée par", getValue: (r) => r.createdBy?.fullname ?? "—" , key:""},
  ]
}

export function getATraiterVenteExportColumns<T extends VenteComptable>(): ExportColumn<T>[] {
  return [
    { label: "N°", getValue: (r) => r.id ?? "—" , key:''},
    { label: "Code", getValue: (r) => r.code ?? "—", key:'' },
    { label: "Envoyé par", getValue: (r) => r.venteComptability?.sender?.fullname ?? "—" , key:''},
    { label: "Envoyé le", getValue: (r) => formatDateFR(r.venteComptability?.comptabilizedAt), key:'' },
    { label: "Traitée le", getValue: (r) => treatedAtValue(r.venteComptability), key:'' },
    { label: "Produit", getValue: (r) => r.produit?.name ?? "—" , key:''},
    { label: "Client", getValue: (r) => r.client?.raison_sociale ?? "—", key:'' },
    { label: "Date", getValue: (r) => formatDateFR(r.date, "--") , key:''},
    { label: "Prix unitaire", getValue: (r) => formatNumberFR(r.unitePrice) , key:''},
    { label: "Quantité totale", getValue: (r) => formatNumberFR(r.qteTotal) , key:''},
    { label: "Remise", getValue: (r) => formatNumberFR(r.remise) , key:''},
    { label: "Transport", getValue: (r) => formatNumberFR(r.transport) , key:''},
    { label: "Montant", getValue: (r) => formatNumberFR(r.montant) , key:''},
    { label: "Type facture", getValue: (r) => r.typeFactureVente?.name ?? "—", key:'' },
    { label: "Crée par", getValue: (r) => r.createdBy?.fullname ?? "—", key:'' },
  ]
}
