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
import { Field, FieldLabel } from "@/components/ui/field"


export default function UpdateChauffeurModal({ open, onOpenChange, chauffeur, setReload }) {
  const router = useRouter()

  const [data, setData] = useState({ fullname: '', permis: '', phone: '' })
  const [errors, setErrors] = useState({ fullname: '', permis: '', phone: '' })

  useEffect(() => {
    if (!chauffeur) return
    setData({ fullname: chauffeur.fullname, permis: '', phone: chauffeur.phone })
  }, [chauffeur])

  const handleChange = (e) => {
    const { name, type, value, files } = e.target
    setData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }))
  }

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    // ✅ construit un vrai FormData pour multer
    const formData = new FormData()
    formData.append('fullname', data.fullname)
    formData.append('phone', data.phone)

    if (data.permis instanceof File) {
      formData.append('permis', data.permis)
    }

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.updateChauffeur(chauffeur.id), formData),
        {
          loading: `Mise à jour en cours du chauffeur ${chauffeur?.fullname}...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            // redirection
            setReload(true)
            router.push(routes.chauffeur?.list)
            router.refresh()
            onOpenChange(false)
            return 'Chauffeur modifié.e avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 402) {
              const validationErrors = err.response.data?.errors
              const { fullname, phone, permis } = validationErrors
              setErrors({
                fullname: fullname?._errors[0],
                phone: phone?._errors[0],
                permis: permis?._errors[0],
              })
              return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
            }

            return err?.response?.data?.message || err?.message || "Erreur de mise à jour de l'utilisateur"
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
            <PencilLine /> Modifier le chauffeur
            <span className="badge bg-light rounded border text-dark">{chauffeur?.fullname}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier ce chauffeur.
          </DialogDescription>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12 mb-2">
            <Label htmlFor="fullname">Nom Complet  <span className="text-danger">*</span></Label>
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
            <Label htmlFor="phone">Télephone  <span className="text-danger">*</span></Label>
            <Input id="phone"
              type="text"
              name="phone"
              required
              value={data.phone}
              onChange={handleChange} />
            {errors.phone && <span className="text-danger">{errors.phone}</span>}
          </div>
        </div>
        <div className="col-md-12 mb-2">
          <Field>
            <FieldLabel htmlFor="permis">Permis</FieldLabel>
            <Input
              id="permis"
              type="file"
              name="permis"
              onChange={(e) => handleChange(e)}
            />
          </Field>
          {errors.permis && <span className="text-danger">{errors.permis}</span>}
        </div>

        <DialogFooter>
          <Button className="shadow-sm rounded" variant="outline" onClick={() => onOpenChange(false)}><X /> Annuler</Button>
          <Button type="submit" className="bg-dark text-white shadow-sm rounded" onClick={submitUpdateForm}><SquareArrowRightEnter /> Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}