import { ExportColumn, formatDateFR, formatNumberFR } from "@/lib/exportHelpers"
import { Approvisionnement } from "@/app/dashboard/vente/reglement/columns"

export const venteReglementExportColumns: ExportColumn<Approvisionnement>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Code", getValue: (r) => r.code ?? "—" },
  { label: "Reference", getValue: (r) => r.reference ?? "—" },
  { label: "Montant", getValue: (r) => formatNumberFR(Number(r.montant)) },
  { label: "Date", getValue: (r) => formatDateFR(String(r.date)) },
  { label: "Type reçu", getValue: (r) => r.typeDetailRecu?.name ?? "—" },
  {
    label: "Compte",
    getValue: (r) => `${r.compteBancaire?.intitule ?? ""} - ${r.compteBancaire?.numero ?? ""}` || "—",
  },
  { label: "Preuve", getValue: (r) => r.preuve ?? "--" },
  { label: "Commentaire", getValue: (r) => r.comment ?? "—" },
  { label: "Validé le", getValue: (r) => formatDateFR(r.validatedAt) },
  { label: "Validé par", getValue: (r) => r.validatedBy?.fullname ?? "—" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
  { label: "Crée par", getValue: (r) => r.createdBy?.fullname ?? "—" },
]
