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
    { label: "N°", getValue: (r) => r.id ?? "—" },
    { label: "Code", getValue: (r) => r.code ?? "—" },
    { label: "Produit", getValue: (r) => r.produit?.name ?? "—" },
    { label: "Code Commande", getValue: (r) => r.commandeClient?.code ?? "—" },
    { label: "Commande Client", getValue: (r) => r.commandeClient?.client?.raison_sociale ?? "—" },
    { label: "Date", getValue: (r) => formatDateFR(r.date, "--") },
    { label: "Client Payeur", getValue: (r) => r.client?.raison_sociale ?? "—" },
    { label: "Prix unitaire", getValue: (r) => formatNumberFR(r.unitePrice) },
    { label: "Quantité totale", getValue: (r) => formatNumberFR(r.qteTotal) },
    { label: "Remise", getValue: (r) => formatNumberFR(r.remise) },
    { label: "Transport", getValue: (r) => formatNumberFR(r.transport) },
    { label: "Montant", getValue: (r) => formatNumberFR(r.montant) },
    { label: "Type", getValue: (r) => r.type?.name ?? "—" },
    { label: "Type facture", getValue: (r) => r.typeFactureVente?.name ?? "—" },
    {
      label: "Statut",
      getValue: (r) => {
        if (r.statut?.id && r.statut?.name) return r.statut.name
        return "En Cours"
      },
    },
    { label: "Preuve", getValue: (r) => r.preuve ?? "---" },
    { label: "Destination", getValue: (r) => r.destination ?? "—" },
    { label: "Observation", getValue: (r) => r.observation ?? "—" },
    { label: "Validé le", getValue: (r) => formatDateFR(r.validatedAt) },
    { label: "Validé par", getValue: (r) => r.validatedBy?.fullname ?? "—" },
    { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
    { label: "Crée par", getValue: (r) => r.createdBy?.fullname ?? "—" },
  ]
}

export function getComptabilizedVenteExportColumns<T extends VenteComptable>(): ExportColumn<T>[] {
  return [
    { label: "N°", getValue: (r) => r.id ?? "—" },
    { label: "Code", getValue: (r) => r.code ?? "—" },
    { label: "Envoyé par", getValue: (r) => r.venteComptability?.sender?.fullname ?? "—" },
    { label: "Envoyé le", getValue: (r) => formatDateFR(r.venteComptability?.comptabilizedAt) },
    { label: "Traitée le", getValue: (r) => treatedAtValue(r.venteComptability) },
    { label: "Produit", getValue: (r) => r.produit?.name ?? "—" },
    { label: "Client", getValue: (r) => r.client?.raison_sociale ?? "—" },
    { label: "Date", getValue: (r) => formatDateFR(r.date, "--") },
    { label: "Prix unitaire", getValue: (r) => formatNumberFR(r.unitePrice) },
    { label: "Quantité totale", getValue: (r) => formatNumberFR(r.qteTotal) },
    { label: "Remise", getValue: (r) => formatNumberFR(r.remise) },
    { label: "Transport", getValue: (r) => formatNumberFR(r.transport) },
    { label: "Montant", getValue: (r) => formatNumberFR(r.montant) },
    { label: "AIB unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceAib) },
    { label: "TVA Unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceTva) },
    { label: "Prix 1.18", getValue: (r) => formatNumberFR(r.venteComptability?.price118) },
    { label: "Marge unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceMarge) },
    { label: "Prix TTC unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceTtc) },
    { label: "Prix HT", getValue: (r) => formatNumberFR(r.venteComptability?.priceHT) },
    { label: "Prix AIB", getValue: (r) => formatNumberFR(r.venteComptability?.priceAib) },
    { label: "Prix TVA", getValue: (r) => formatNumberFR(r.venteComptability?.priceTva) },
    { label: "Prix marge", getValue: (r) => formatNumberFR(r.venteComptability?.priceMarge) },
    { label: "Prix TTC", getValue: (r) => formatNumberFR(r.venteComptability?.priceTtc) },
    { label: "Type facture", getValue: (r) => r.typeFactureVente?.name ?? "—" },
    { label: "Crée par", getValue: (r) => r.createdBy?.fullname ?? "—" },
  ]
}

export function getTraiterVenteExportColumns<T extends VenteComptable>(): ExportColumn<T>[] {
  return [
    { label: "N°", getValue: (r) => r.id ?? "—" },
    { label: "Code", getValue: (r) => r.code ?? "—" },
    { label: "Envoyé par", getValue: (r) => r.venteComptability?.sender?.fullname ?? "—" },
    { label: "Envoyé le", getValue: (r) => formatDateFR(r.venteComptability?.comptabilizedAt) },
    { label: "Traitée le", getValue: (r) => treatedAtValue(r.venteComptability) },
    { label: "Produit", getValue: (r) => r.produit?.name ?? "—" },
    { label: "Client", getValue: (r) => r.client?.raison_sociale ?? "—" },
    { label: "Date", getValue: (r) => formatDateFR(r.date, "--") },
    { label: "Prix unitaire", getValue: (r) => formatNumberFR(r.unitePrice) },
    { label: "Quantité totale", getValue: (r) => formatNumberFR(r.qteTotal) },
    { label: "Remise", getValue: (r) => formatNumberFR(r.remise) },
    { label: "Transport", getValue: (r) => formatNumberFR(r.transport) },
    { label: "Montant", getValue: (r) => formatNumberFR(r.montant) },
    { label: "AIB unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceAib) },
    { label: "TVA Unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceTva) },
    { label: "Marge unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceMarge) },
    { label: "Prix TTC unitaire", getValue: (r) => formatNumberFR(r.venteComptability?.unitPriceTtc) },
    { label: "Prix HT", getValue: (r) => formatNumberFR(r.venteComptability?.priceHT) },
    { label: "Prix AIB", getValue: (r) => formatNumberFR(r.venteComptability?.priceAib) },
    { label: "Prix TVA", getValue: (r) => formatNumberFR(r.venteComptability?.priceTva) },
    { label: "Prix marge", getValue: (r) => formatNumberFR(r.venteComptability?.priceMarge) },
    { label: "Prix 1.18", getValue: (r) => formatNumberFR(r.venteComptability?.price118) },
    { label: "Prix TTC", getValue: (r) => formatNumberFR(r.venteComptability?.priceTtc) },
    { label: "Type facture", getValue: (r) => r.typeFactureVente?.name ?? "—" },
    { label: "Crée par", getValue: (r) => r.createdBy?.fullname ?? "—" },
  ]
}

export function getATraiterVenteExportColumns<T extends VenteComptable>(): ExportColumn<T>[] {
  return [
    { label: "N°", getValue: (r) => r.id ?? "—" },
    { label: "Code", getValue: (r) => r.code ?? "—" },
    { label: "Envoyé par", getValue: (r) => r.venteComptability?.sender?.fullname ?? "—" },
    { label: "Envoyé le", getValue: (r) => formatDateFR(r.venteComptability?.comptabilizedAt) },
    { label: "Traitée le", getValue: (r) => treatedAtValue(r.venteComptability) },
    { label: "Produit", getValue: (r) => r.produit?.name ?? "—" },
    { label: "Client", getValue: (r) => r.client?.raison_sociale ?? "—" },
    { label: "Date", getValue: (r) => formatDateFR(r.date, "--") },
    { label: "Prix unitaire", getValue: (r) => formatNumberFR(r.unitePrice) },
    { label: "Quantité totale", getValue: (r) => formatNumberFR(r.qteTotal) },
    { label: "Remise", getValue: (r) => formatNumberFR(r.remise) },
    { label: "Transport", getValue: (r) => formatNumberFR(r.transport) },
    { label: "Montant", getValue: (r) => formatNumberFR(r.montant) },
    { label: "Type facture", getValue: (r) => r.typeFactureVente?.name ?? "—" },
    { label: "Crée par", getValue: (r) => r.createdBy?.fullname ?? "—" },
  ]
}
