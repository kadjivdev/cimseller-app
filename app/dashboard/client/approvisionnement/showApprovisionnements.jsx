import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { DataTable } from "./data-table"

export default function ShowApprovisionnementsSheet({ open, onOpenChange, client }) {

  if (!client) return

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="max-h-[100vh]">
        <SheetHeader>
          <SheetTitle>{client?.raison_sociale ?? "Détails"}</SheetTitle>
          <SheetDescription>
            Liste des approvisionnements pour ce client.
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-4 flex-1 max-h-[100vh]">
          <DataTable
            data={client.approvisionnements}
          />
        </div>
        <SheetFooter className="flex justify-center items-center">
          <SheetClose asChild>
            <Button
              variant="outline"
              className="bg-neutral-900 text-white hover:bg-neutral-800 w-1/2 rounded shadow"
            >
              <X /> Fermer
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}