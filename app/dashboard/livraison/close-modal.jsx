"use client"

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

import { toast } from "sonner"
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import { useRouter } from "next/navigation"
import routes from "@/app/routes"
import { PencilLine, SquareArrowRightEnter, X } from "lucide-react";

export default function CloseProgrammationModal({ open, onOpenChange, programmation, handleBonSelect }) {
  const router = useRouter()

  // initialisation des erreurs
  useEffect(() => {
    if (!open) return
    if (!programmation) return
    console.log("La programmation :", programmation)
  }, [open, programmation])

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    try {
      await toast.promise(
        axiosInstance.post(apiRoutes.cloturerProgrammation(programmation?.id)),
        {
          loading: `Clôture de la programmation ${programmation?.code} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            router.push(routes.livraison.list)
            router.refresh()
            handleBonSelect(programmation?.commandeId)
            onOpenChange(false)

            return `Programmation clôturée avec succès!`
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)
            return err?.response?.data?.error || "Erreur de mise à jour du bon"
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
            <PencilLine />Clôture de la programmation
            <span className="badge mx-1 bg-dark rounded border text-white"> {programmation?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Voulez-vous vraiment clôturer cette programmation?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitUpdateForm}>
          <DialogFooter>
            <Button className="shadow-sm rounded" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Annuler</Button>
            <Button
              type="submit"
              className="bg-dark text-white shadow-sm rounded"
            ><SquareArrowRightEnter /> Clôturer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
