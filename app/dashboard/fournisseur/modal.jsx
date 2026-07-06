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

export default function UpdateFournisseurModal({ open, onOpenChange, fournisseur, setReload }) {
  const router = useRouter()

  const [data, setData] = useState({ raison_sociale: '', phone: '', email: '', adresse: '' })
  const [errors, setErrors] = useState({ raison_sociale: '', phone: '', email: '', adresse: '' })

  useEffect(() => {
    if (!fournisseur) return
    setData({ raison_sociale: fournisseur.raison_sociale, phone: fournisseur.phone, email: fournisseur.email })
  }, [fournisseur])

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.updateFournisseur(fournisseur.id), data),
        {
          loading: `Mise à jour en cours du fournisseur ${fournisseur?.raison_sociale}...`,
          success: async (data) => {
            console.log("Response de mise à jour à succès:", data)

            // redirection
            setReload(true)
            router.push(routes.fournisseur?.list)
            router.refresh()
            onOpenChange(false)
            return 'Fournisseur modifié.e avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 402) {
              const validationErrors = err.response.data?.errors
              const { sigle, raison_sociale, phone, email, adresse } = validationErrors
              setErrors({
                sigle: sigle?._errors[0],
                raison_sociale: raison_sociale?._errors[0],
                phone: phone?._errors[0],
                email: email?._errors[0],
                adresse: adresse?._errors[0],
              })
              return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
            }

            return err?.response?.data?.error || err?.message || "Erreur de mise à jour du fournisseur"
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
      <DialogContent className="sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            <PencilLine /> Modifier le fournisseur <span className="badge bg-light rounded border text-dark">{fournisseur?.raison_sociale}</span>
            <span className="badge bg-light rounded border text-dark">{fournisseur?.fullname}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier ce fournisseur.
          </DialogDescription>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12 mb-2">
            <Label htmlFor="raison_sociale">Raison sociale  <span className="text-danger">*</span></Label>
            <Input id="raison_sociale"
              type="text"
              name="raison_sociale"
              placeholder="Ex: NOUVELLE CIMENTERIE BENIN"
              required
              value={data.raison_sociale}
              onChange={handleChange} />
            {errors.raison_sociale && <span className="text-danger">{errors.raison_sociale}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="phone">Téléphone  </Label>
            <Input id="phone"
              type="text"
              name="phone"
              placeholder="Ex: +2290156854397"
              value={data.phone}
              onChange={handleChange} />
            {errors.phone && <span className="text-danger">{errors.phone}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="adresse">Adresse  </Label>
            <Input id="adresse"
              type="text"
              name="adresse"
              placeholder="Ex: COTONOU"
              value={data.adresse}
              onChange={handleChange} />
            {errors.adresse && <span className="text-danger">{errors.adresse}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="phone">Email  </Label>
            <Input id="email"
              type="email"
              name="email"
              placeholder="Ex: gogochristian009@gmail.com"
              value={data.email}
              onChange={handleChange} />
            {errors.email && <span className="text-danger">{errors.email}</span>}
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