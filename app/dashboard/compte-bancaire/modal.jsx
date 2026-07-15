"use client"

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

import { toast } from "sonner"
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import { useRouter } from "next/navigation"
import routes from "@/app/routes"
import { PencilLine, SquareArrowRightEnter, X } from "lucide-react";
import { FilterSelect } from "@/myComponents/FilterSelect"


export default function UpdateCompteBancaireModal({ open, onOpenChange, compteBancaire, setReload, banques }) {
  const router = useRouter()

  const [data, setData] = useState({ banqueId: '', intitule: '', numero: '' })
  const [errors, setErrors] = useState({ banqueId: '', intitule: '', numero: '' })

  useEffect(() => {
    if (!compteBancaire) return
    setData({ banqueId: compteBancaire.banqueId, intitule: compteBancaire.intitule, numero: compteBancaire.numero })
  }, [compteBancaire])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  // handle role selection
  const handleSelect = (banqueId) => {
    console.log("Le role selectionné :", banqueId)
    setData((prev) => ({ ...prev, banqueId: banqueId }))
  }

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.updateCompteBancaire(compteBancaire.id), data),
        {
          loading: `Mise à jour en cours du compte bancaire ${compteBancaire?.intitule} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            // redirection
            setReload(true)
            router.push(routes.compteBancaire?.list)
            router.refresh()
            onOpenChange(false)
            return 'Compte bancaire modifié avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 402) {
              const validationErrors = err.response.data?.errors
              const { banqueId, intitule, numero } = validationErrors
              setErrors({
                banqueId: banqueId?._errors[0],
                intitule: intitule?._errors[0],
                numero: numero?._errors[0],
              })
              return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
            }

            return err?.response?.data?.error || err?.message || "Erreur de mise à jour de l'utilisateur"
          },
        }
      )

      // redirection
      // router.push(routes.compteBancaire?.list)
      router.refresh()
      setReload(true)
      onOpenChange(false)

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
      <DialogContent className="sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            <PencilLine /> Modifier le compte bancaire
            <span className="badge bg-light rounded border text-dark">{compteBancaire?.intitule}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier ce compte.
          </DialogDescription>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12 mb-2">
            <Label htmlFor="intitule">Intitulé  <span className="text-danger">*</span></Label>
            <Input id="intitule"
              type="text"
              name="intitule"
              autoFocus
              required
              value={data.intitule}
              onChange={handleChange} />
            {errors.name && <span className="text-danger">{errors.intitule}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="numero">Numéro  <span className="text-danger">*</span></Label>
            <Input id="numero"
              type="text"
              name="numero"
              required
              value={data.numero}
              onChange={handleChange} />
            {errors.name && <span className="text-danger">{errors.numero}</span>}
          </div>
          <div className="col-md-12">
            <Label htmlFor="representant_id">Choisissez une banque</Label>
            <FilterSelect
              options={banques?.map((b) => ({ id: b.id, label: `${b.name}` }))}
              handleSelect={handleSelect}
              selected={data?.banqueId}
            />
            {errors.banqueId && <span className="text-center">{errors.banqueId}</span>}
          </div>
        </div>

        <DialogFooter>
          <Button className="shadow-sm rounded" variant="outline" onClick={() => onOpenChange(false)}><X /> Annuler</Button>
          <Button type="submit" className="bg-dark text-white shadow-sm rounded" onClick={submitUpdateForm}><SquareArrowRightEnter /> Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}