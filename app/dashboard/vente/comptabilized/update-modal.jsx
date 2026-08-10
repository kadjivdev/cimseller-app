"use client"

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { toast } from "sonner"
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import { useRouter } from "next/navigation"
import { PencilLine, Send, X } from "lucide-react";

export default function UpdateVenteModal({ open, onOpenChange, vente,setReload }) {
  const router = useRouter()

  // submission
  const updateVenteForm = async (e) => {
    e.preventDefault()

    try {
      await toast.promise(
        axiosInstance.post(apiRoutes.createComptabilities, {venteId:vente?.id}),
        {
          loading: `Envoie en comptabilité de la vente ${vente?.code} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            setReload(true)
            // router.push(routes.vente?.aComptabiliser)
            router.refresh()
            onOpenChange(false)

            return `Vente envoyée à la comptabilité avec succès!`
          },
          error: (err) => {
            console.log("Erreur complète :", err.response?.data)
            return err?.response?.data?.error || "Erreure d'insersion de la vente"
          },
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
            <PencilLine />Envoie à comptabiliser de la vente
            <span className="badge mx-1 bg-dark rounded border text-white"> {vente?.code}</span>
          </DialogTitle>
          <DialogDescription>
            L'envoie à la comptabilité sera définitif et irréversible!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={updateVenteForm}>
          <DialogFooter className="flex justify-content-center">
            <Button className="shadow-sm rounded bg-dark text-white" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Annuler</Button>
            <Button
              type="submit"
              className="bg-success text-white shadow-sm rounded"
            ><Send /> Envoyer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
