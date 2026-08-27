"use client"

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { toast } from "sonner"
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import { PencilLine, Send, X } from "lucide-react";

export default function ExportVentesModal({ open, onOpenChange, setReload }) {

  const exportVentes = async (e) => {
    e.preventDefault()

    try {
      toast.promise(
        async () => {
          const res = await axiosInstance.get(apiRoutes.exportVente, {
            responseType: 'blob', // important : on attend un fichier binaire, pas du JSON
          })

          // Création d'une URL temporaire pointant sur le blob reçu
          const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })
          const url = window.URL.createObjectURL(blob)

          // Ouvre le fichier dans un nouvel onglet (ou déclenche le téléchargement, voir plus bas)
          window.open(url, '_blank')

          // Libère la mémoire après un court délai
          setTimeout(() => window.URL.revokeObjectURL(url), 10000)

          return res
        },
        {
          loading: 'Exportation des ventes traitées ...',
          success: () => {
            setReload((prev) => prev + 1)
            onOpenChange(false)
            return 'Ventes exportées avec succès!'
          },
          error: (err) => err?.response?.data?.error || 'Erreur d\'exportation des ventes',
        }
      )
    } catch (error) {
      console.log("Erreur catchée :", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[800px] sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="bg-light p-1">
          <DialogTitle>
            <PencilLine />Exporter toutes les ventes traitées.
          </DialogTitle>
          <DialogDescription>
            L'exportation sera définitive et irréversible!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={exportVentes}>
          <DialogFooter className="flex justify-content-center">
            <Button className="shadow-sm rounded bg-dark text-white" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Annuler</Button>
            <Button
              type="submit"
              className="bg-success text-white shadow-sm rounded"
            ><Send /> Envoyer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}