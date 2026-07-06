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


export default function UpdateAvaliseurModal({ open, onOpenChange, avaliseur, setReload }) {
  const router = useRouter()

  const [data, setData] = useState({ fullname: '', phone: '', email: '' })
  const [errors, setErrors] = useState({ fullname: '', phone: '', email: '' })

  useEffect(() => {
    if (!avaliseur) return
    setData({ fullname: avaliseur.fullname, phone: avaliseur.phone, email: avaliseur.email })
  }, [avaliseur])

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
        axiosInstance.put(apiRoutes.updateAvaliseur(avaliseur.id), data),
        {
          loading: `Mise à jour en cours de l'avaliseur ${avaliseur?.fullname}...`,
          success: async (data) => {
            console.log("Response de mise à jour à succès:", data)

            // redirection
            setReload(true)
            router.push(routes.avaliseur?.list)
            router.refresh()
            onOpenChange(false)
            return 'Avaliseur modifié.e avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 402) {
              const validationErrors = err.response.data?.errors
              const { fullname, phone, email } = validationErrors
              setErrors({
                fullname: fullname?._errors[0],
                phone: phone?._errors[0],
                email: email?._errors[0],
              })
              return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
            }

            return err?.response?.data?.error || err?.message || "Erreur de mise à jour de l'utilisateur"
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
            <PencilLine /> Modifier l'avaliseur
            <span className="badge bg-light rounded border text-dark">{avaliseur?.fullname}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier ce camion.
          </DialogDescription>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12 mb-2">
            <Label htmlFor="immatriculation">Nom complet  <span className="text-danger">*</span></Label>
            <Input id="fullname"
              type="text"
              name="fullname"
              autoFocus
              required
              value={data.fullname}
              onChange={handleChange} />
            {errors.fullname && <span className="text-danger">{errors.fullname}</span>}
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