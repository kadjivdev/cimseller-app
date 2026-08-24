/**
 * One-off script to fix export columns in all data-table files.
 * Run: node scripts/fix-export-columns.mjs
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

const patches = [
  {
    file: "app/dashboard/client/data-table.tsx",
    typeImport: 'import { Client } from "../client/columns"',
    exportBlock: `const exportColumns: ExportColumn<Client>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Raison sociale", key: "raison_sociale" },
  { label: "Montant approvisionné", getValue: (r) => formatNumberFR(Number(r.approvisionnementAmount)) },
  { label: "Montant réglé", getValue: (r) => formatNumberFR(Number(r.reglementAmount)) },
  { label: "Vente validée", getValue: (r) => formatNumberFR(Number(r.venteAmount)) },
  { label: "Solde Client", getValue: (r) => formatNumberFR(Number(r.solde)) },
  { label: "Zone", getValue: (r) => r.zone?.name ?? "—" },
  { label: "Status", getValue: (r) => r.statut?.name ?? "—" },
  { label: "Profil", getValue: (r) => (r.profil ? String(r.profil) : "—") },
  { label: "Télephone", getValue: (r) => r.phone ? String(r.phone) : "--" },
  { label: "Email", getValue: (r) => r.email ?? "--" },
  { label: "Adresse", getValue: (r) => (r.adresse ? String(r.adresse) : "—") },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
]`,
  },
  {
    file: "app/dashboard/client/vente/data-table.tsx",
    typeImport: 'import { Vente } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<Vente>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Code", getValue: (r) => r.code ?? "—" },
  { label: "Produit", getValue: (r) => r.produit?.name ?? "—" },
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
  { label: "Statut", getValue: (r) => (r.statut?.id && r.statut?.name ? String(r.statut.name) : "En Cours") },
  { label: "Preuve", getValue: (r) => r.preuve ?? "---" },
  { label: "Destination", getValue: (r) => (r.destination ? String(r.destination) : "—") },
  { label: "Observation", getValue: (r) => (r.observation ? String(r.observation) : "—") },
  { label: "Validé le", getValue: (r) => formatDateFR(r.validatedAt) },
  { label: "Validé par", getValue: (r) => r.validatedBy?.fullname ?? "—" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
  { label: "Crée par", getValue: (r) => r.createdBy?.fullname ?? "—" },
]`,
  },
  {
    file: "app/dashboard/vente/reglement/data-table.tsx",
    typeImport: 'import { Approvisionnement } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<Approvisionnement>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Code", getValue: (r) => r.code ?? "—" },
  { label: "Reference", getValue: (r) => r.reference ?? "—" },
  { label: "Montant", getValue: (r) => formatNumberFR(Number(r.montant)) },
  { label: "Date", getValue: (r) => formatDateFR(String(r.date)) },
  { label: "Type reçu", getValue: (r) => r.typeDetailRecu?.name ?? "—" },
  { label: "Compte", getValue: (r) => \`\${r.compteBancaire?.intitule ?? ""} - \${r.compteBancaire?.numero ?? ""}\` || "—" },
  { label: "Preuve", getValue: (r) => r.preuve ?? "--" },
  { label: "Commentaire", getValue: (r) => r.comment ?? "—" },
  { label: "Validé le", getValue: (r) => formatDateFR(r.validatedAt) },
  { label: "Validé par", getValue: (r) => r.validatedBy?.fullname ?? "—" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
  { label: "Crée par", getValue: (r) => r.createdBy?.fullname ?? "—" },
]`,
  },
  {
    file: "app/dashboard/agent/data-table.tsx",
    typeImport: 'import { Agent } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<Agent>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Nom", key: "nom" },
  { label: "Prénom", key: "prenom" },
  { label: "Téléphone", key: "phone" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
]`,
  },
  {
    file: "app/dashboard/user/data-table.tsx",
    typeImport: 'import { User } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<User>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Nom Complet", key: "fullname" },
  { label: "Email", key: "email" },
  { label: "Rôle", key: "role.name" },
  { label: "Zone", key: "zone.name" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
]`,
  },
  {
    file: "app/dashboard/role/data-table.tsx",
    typeImport: 'import { Role } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<Role>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Nom", key: "name" },
  { label: "Description", key: "description" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.created_at) },
]`,
  },
  {
    file: "app/dashboard/permission/data-table.tsx",
    typeImport: 'import { Permission } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<Permission>[] = [
  { label: "Nom", key: "name" },
  { label: "Description", key: "description" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.created_at) },
]`,
  },
  {
    file: "app/dashboard/zone/data-table.tsx",
    typeImport: 'import { Zone } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<Zone>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Nom", key: "name" },
  { label: "Representant", getValue: (r) => \`\${r.representant?.nom ?? ""} - \${r.representant?.prenom ?? ""}\` },
  { label: "Description", key: "description" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
]`,
  },
  {
    file: "app/dashboard/banque/data-table.tsx",
    typeImport: 'import { Banque } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<Banque>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Nom", key: "name" },
  { label: "Description", key: "description" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
]`,
  },
  {
    file: "app/dashboard/camion/data-table.tsx",
    typeImport: 'import { Camion } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<Camion>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Marque", key: "marque.name" },
  { label: "Immatriculation", key: "immatriculation" },
  { label: "Libelle", key: "libelle" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
]`,
  },
  {
    file: "app/dashboard/chauffeur/data-table.tsx",
    typeImport: 'import { Chauffeur } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<Chauffeur>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Nom complet", key: "fullname" },
  { label: "Téléphone", key: "phone" },
  { label: "Permis", getValue: (r) => r.permis ?? "—" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
]`,
  },
  {
    file: "app/dashboard/representant/data-table.tsx",
    typeImport: 'import { Representant } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<Representant>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Nom", key: "nom" },
  { label: "Prénom", key: "prenom" },
  { label: "Téléphone", key: "phone" },
  { label: "Zones", getValue: (r) => (r.zones?.length ? r.zones.map((z) => z.name).join(", ") : "--") },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
]`,
  },
  {
    file: "app/dashboard/fournisseur/data-table.tsx",
    typeImport: 'import { Fournisseur } from "../fournisseur/columns"',
    exportBlock: `const exportColumns: ExportColumn<Fournisseur>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Sigle", key: "sigle" },
  { label: "Raison sociale", key: "raison_sociale" },
  { label: "Email", key: "email" },
  { label: "Téléphone", key: "phone" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
]`,
  },
  {
    file: "app/dashboard/produit/data-table.tsx",
    typeImport: 'import { Produit } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<Produit>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Nom", key: "name" },
  { label: "Type", key: "type.name" },
  { label: "Prix fournisseur", getValue: (r) => (r.fournisseurPrice != null ? String(r.fournisseurPrice) : "—") },
  { label: "Image", getValue: (r) => r.image ?? "--" },
  { label: "Description", key: "description" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
]`,
  },
  {
    file: "app/dashboard/compte-bancaire/data-table.tsx",
    typeImport: 'import { CompteBancaire } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<CompteBancaire>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Numéro", key: "numero" },
  { label: "Banque", key: "banque.name" },
  { label: "Intitulé", key: "intitule" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
]`,
  },
  {
    file: "app/dashboard/avaliseur/data-table.tsx",
    typeImport: 'import { Avaliseur } from "./columns"',
    exportBlock: `const exportColumns: ExportColumn<Avaliseur>[] = [
  { label: "N°", getValue: (r) => r.id ?? "—" },
  { label: "Nom complet", key: "fullname" },
  { label: "Téléphone", key: "phone" },
  { label: "Email", key: "email" },
  { label: "Crée le", getValue: (r) => formatDateFR(r.createdAt) },
]`,
  },
]

function patchFile({ file, typeImport, exportBlock }) {
  const filePath = path.join(root, file)
  let content = fs.readFileSync(filePath, "utf8")

  content = content.replace(
    /import \{ TableActions \} from "\.\/tableActions"/,
    'import { TableActions } from "@/myComponents/TableActions"\nimport { ExportColumn, formatDateFR, formatNumberFR } from "@/lib/exportHelpers"'
  )

  if (!content.includes(typeImport.split(" from ")[0])) {
    const importLine = typeImport + "\n"
    content = content.replace(
      /import \{ ExportColumn, formatDateFR, formatNumberFR \} from "@\/lib\/exportHelpers"/,
      `import { ExportColumn, formatDateFR, formatNumberFR } from "@/lib/exportHelpers"\n${importLine}`
    )
  }

  content = content.replace(/const exportColumns = \[[\s\S]*?\]\n\n/, `${exportBlock}\n\n`)

  fs.writeFileSync(filePath, content)
  console.log("Patched:", file)
}

for (const patch of patches) {
  patchFile(patch)
}

console.log("Done:", patches.length, "files")
