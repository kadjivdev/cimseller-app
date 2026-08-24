export function formatDateFR(date: string | null | undefined, empty = "—"): string {
  if (!date) return empty
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function formatNumberFR(value: number | null | undefined, empty = "—"): string {
  if (value == null) return empty
  return value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })
}

export function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc == null || typeof acc !== "object") return undefined
    return (acc as Record<string, unknown>)[part]
  }, obj)
}

export function resolveExportValue(obj: unknown, path: string): string {
  const val = getNestedValue(obj, path)
  if (val == null || val === "") return "—"
  if (typeof val === "object") {
    const record = val as Record<string, unknown>
    const resolved = record.name ?? record.fullname ?? record.raison_sociale ?? record.code
    return resolved != null ? String(resolved) : "—"
  }
  if (typeof val === "boolean") return val ? "Oui" : "Non"
  return String(val)
}

export type ExportColumn<T> = {
  label: string
  key?: string
  getValue?: (row: T) => string | number
}

export function getExportCellValue<T>(row: T, column: ExportColumn<T>): string {
  if (column.getValue) return String(column.getValue(row) ?? "—")
  if (column.key) return resolveExportValue(row, column.key)
  return "—"
}
