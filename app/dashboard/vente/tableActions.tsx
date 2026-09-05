// app/components/TableActions.tsx
"use client"

import { Button } from "@/components/ui/button"
import { FileSpreadsheet, FileText, Printer } from "lucide-react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

type ExportColumn<T> = {
  label: string
  key: keyof T
  // ✅ Accesseur optionnel pour extraire une valeur imbriquée (ex: role.name)
  accessor?: (row: T) => string | number
}

type TableActionsProps<T> = {
  data: T[]
  columns: ExportColumn<T>[]
  filename?: string
}

export function TableActions<T extends object>({
  data,
  columns,
  filename = "export",
}: TableActionsProps<T>) {

  // ✅ Fonction centralisée pour récupérer la valeur affichable d'une colonne
  const getValue = (row: T, col: ExportColumn<T>): string | number => {
    if (col.accessor) {
      return col.accessor(row) ?? "—"
    }
    const value = row[col.key]
    // Filet de sécurité si jamais un objet passe malgré tout
    if (value !== null && typeof value === "object") {
      return "—"
    }
    return (value as string | number) ?? "—"
  }

  // ─── Export Excel ───────────────────────────────────────────
  const exportExcel = () => {
    const rows = data.map((row) =>
      Object.fromEntries(columns.map((col) => [col.label, getValue(row, col)]))
    )
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    XLSX.writeFile(wb, `${filename}.xlsx`)
  }

  // ─── Export PDF ─────────────────────────────────────────────
  const exportPDF = () => {
    const doc = new jsPDF()
    autoTable(doc, {
      head: [columns.map((c) => c.label)],
      body: data.map((row) => columns.map((col) => String(getValue(row, col)))),
    })
    doc.save(`${filename}.pdf`)
  }

  // ─── Imprimer ────────────────────────────────────────────────
  const handlePrint = () => window.print()

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={exportExcel}
        className="text-green-700 border-green-300 hover:bg-green-50 rounded shadow">
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Excel
      </Button>

      <Button variant="outline" size="sm" onClick={exportPDF}
        className="text-red-700 border-red-300 hover:bg-red-50 rounded shadow">
        <FileText className="mr-2 h-4 w-4" />
        PDF
      </Button>

      <Button variant="outline" size="sm" onClick={handlePrint}
        className="text-blue-700 border-blue-300 hover:bg-blue-50 rounded shadow">
        <Printer className="mr-2 h-4 w-4" />
        Imprimer
      </Button>
    </div>
  )
}