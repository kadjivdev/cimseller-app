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
import { Textarea } from "@/components/ui/textarea"


export default function UpdateZoneModal({ open, onOpenChange, zone, setReload }) {
  const router = useRouter()

  const [data, setData] = useState({ name: '', description: '' })
  const [errors, setErrors] = useState({ name: '', description: '' })

  useEffect(() => {
    if (!zone) return
    setData({ name: zone.name, description: zone.description || '' })
  }, [zone])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.updateZone(zone.id), data),
        {
          loading: `Mise à jour en cours de la zone ${zone?.name}...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            // redirection
            setReload(true)
            router.push(routes.zone?.list)
            router.refresh()
            onOpenChange(false)
            return 'Zone modifié.e avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 402) {
              const validationErrors = err.response.data?.errors
              const { name, description } = validationErrors
              setErrors({
                name: name?._errors[0],
                description: description?._errors[0],
              })
              return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
            }

            return err?.response?.data?.message || err?.message || "Erreur de mise à jour de l'utilisateur"
          },
        }
      )

      // redirection
      router.push(routes.zone?.list)
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
            <PencilLine /> Modifier la zone
            <span className="badge bg-light rounded border text-dark">{zone?.name}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier cette zone.
          </DialogDescription>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12 mb-2">
            <Label htmlFor="fullname">Nom  <span className="text-danger">*</span></Label>
            <Input id="name"
              type="text"
              name="name"
              autoFocus
              required
              value={data.name}
              onChange={handleChange} />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="description">Description  </Label>
            <Textarea
            rows={1}
            placeholder="Ex :Description"
              id="description"
              name="description"
              value={data.description}
              onChange={handleChange}
            ></Textarea>
            {errors.description && <span className="text-danger">{errors.description}</span>}
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