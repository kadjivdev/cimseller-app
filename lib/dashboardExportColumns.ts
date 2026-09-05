import { ExportColumn, formatDateFR, formatNumberFR } from "@/lib/exportHelpers"
import { Approvisionnement } from "@/app/dashboard/vente/reglement/columns"

const toDisplayValue = (value: unknown): string => {
  if (value == null || value === "") return "—"
  if (typeof value === "object") {
    const record = value as Record<string, unknown>
    const resolved =
      record.name ??
      record.fullname ??
      record.raison_sociale ??
      record.intitule ??
      record.numero ??
      record.code ??
      record.id ??
      "—"
    return String(resolved)
  }
  return String(value)
}

export const venteReglementExportColumns: ExportColumn<Approvisionnement>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—", key: "" },
  { label: "Code", getValue: (r) => r.code ?? "—", key: "" },
  { label: "Reference", getValue: (r) => r.reference ?? "—", key: "" },
  { label: "Montant", getValue: (r) => formatNumberFR(r.montant ?? undefined), key: "" },
  { label: "Date", getValue: (r) => formatDateFR(r.date ?? undefined), key: "" },
  { label: "Type reçu", getValue: (r) => toDisplayValue(r.typeDetailRecu), key: "" },
  {
    label: "Compte",
    getValue: (r) => {
      const compte = r.compteBancaire
      const value = [compte?.intitule, compte?.numero].filter(Boolean).join(" - ")
      return value || "—"
    },
    key: "",
  },
  { label: "Preuve", getValue: (r) => r.preuve ?? "—", key: "" },
  { label: "Commentaire", getValue: (r) => r.comment ?? "—", key: "" },
  { label: "Validé le", getValue: (r) => formatDateFR(r.validatedAt ?? undefined), key: "" },
  { label: "Validé par", getValue: (r) => toDisplayValue(r.validatedBy), key: "" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt ?? undefined), key: "" },
  { label: "Crée par", getValue: (r) => toDisplayValue(r.createdBy), key: "" },
]
