// app/components/TableActions.tsx
"use client"

import { Button } from "@/components/ui/button"
import { FileSpreadsheet, FileText, Printer } from "lucide-react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

type TableActionsProps<T> = {
  data: T[]
  columns: { label: string; key: keyof T }[]
  filename?: string
}

export function TableVersementActions<T extends object>({
  data,
  columns,
  filename = "export",
}: TableActionsProps<T>) {

  // ─── Export Excel ───────────────────────────────────────────
  const exportExcel = () => {
    const rows = data.map((row) =>
      Object.fromEntries(columns.map(({ label, key }) => [label, row[key]]))
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
      body: data.map((row) => columns.map(({ key }) => String(row[key] ?? ""))),
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