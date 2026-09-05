export const getNestedSearchValues = (value: unknown): string[] => {
  if (value == null) return []

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return [String(value)]
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => getNestedSearchValues(item))
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap((item) => getNestedSearchValues(item))
  }

  return []
}

export const globalSearchFilter = (row: { original: unknown }, columnId: string, filterValue: unknown) => {
  const keyword = String(filterValue ?? "").trim().toLowerCase()
  if (!keyword) return true

  const searchableText = getNestedSearchValues(row.original).join(" ").toLowerCase()
  return searchableText.includes(keyword)
}
