"use client"

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

import { toast } from "sonner"
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import { useRouter } from "next/navigation"
import routes from "@/app/routes"
import { PencilLine, SquareArrowRightEnter, X } from "lucide-react";
import { Label } from "@/components/ui/label"

export default function ActualiserProgrammationModal({ open, onOpenChange, programmation, handleBonSelect }) {
  const router = useRouter()

  const [data, setData] = useState({ programId: '', dateSortie: '', bl: '' })
  const [errors, setErrors] = useState({ programId: '', dateSortie: '', bl: '' })

  // initialisation des erreurs
  useEffect(() => {
    if (!open) return
    if (!programmation) return

    console.log("La programmation :", programmation)

    setData((prev) => ({
      ...prev,
      programId: programmation?.id,
      dateSortie: programmation?.dateSortie?.split("T")?.[0] || '',
      bl: programmation?.bl || '',
    }))

    setErrors({
      dateSortie: '', bl: ''
    })
  }, [open, programmation])

  // handleChange
  const handleChange = (e) => {
    e.preventDefault()
    let { value, checked, files, type, name } = e.target
    setData((prev) => ({
      ...prev,
      programId: programmation?.id,
      [name]: type === "file"
        ? files?.[0] ?? null
        : type === "checkbox"
          ? checked
          : value,
    }))
  }

  useEffect(() => {
    console.log("Data to submit:", data)
  }, [data])

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.actualiseProgrammation, data),
        {
          loading: `Actualisation de la programmation ${programmation?.code} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            router.push(routes.suiviSortie?.list)
            router.refresh()
            handleBonSelect(programmation?.commandeId)
            onOpenChange(false)

            return `Programmation actualisée avec succès!`
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 422) {
              const validationErrors = err.response.data?.errors
              const { commandeId, dateSortie, bl } = validationErrors
              setErrors({
                commandeId: commandeId?._errors?.[0],
                dateSortie: dateSortie?._errors?.[0] || '',
                bl: bl?._errors?.[0] || '',
              })
              return err.response.data?.message || `Erreurs de validation pour l'insertion des reçus, vérifiez le formulaire.`
            }

            return err?.response?.data?.error || "Erreur de mise à jour du bon"
          },
        }
      )

    } catch (error) {
      console.log("Erreur catchée :", error)
    }
  }

  useEffect(() => {
    console.log("Data to submit :", data)
  }, [data])

  useEffect(() => {
    console.log("Les erreures :", errors)
  }, [errors])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[800px] sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="bg-light p-1">
          <DialogTitle>
            <PencilLine />Actualisation de la programmation
            <span className="badge mx-1 bg-dark rounded border text-white"> {programmation?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour actualiser la programmation de ce bon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitUpdateForm}>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="dateSortie">Date de sortie </Label>
                <Input id="dateSortie"
                  type="date"
                  name="dateSortie"
                  readOnly={programmation?.dateSortie}
                  value={data?.dateSortie?.split("T")?.[0] || ''}
                  onChange={handleChange} />
                {errors?.dateSortie && <span className="text-danger">{errors?.dateSortie}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="bl">Bl </Label>

                <Input id="bl"
                  type="text"
                  name="bl"
                  placeholder="Ex: 15654543"
                  readOnly={programmation?.bl}
                  value={data.bl}
                  onChange={handleChange} />
                {errors?.bl && <span className="text-danger">{errors?.bl}</span>}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button className="shadow-sm rounded" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Annuler</Button>
            <Button
              type="submit"
              className="bg-dark text-white shadow-sm rounded"
              disabled={programmation?.dateSortie && programmation?.bl}
            ><SquareArrowRightEnter /> Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
