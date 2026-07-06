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
import { FilterSelect } from "@/myComponents/FilterSelect"
import { Separator } from "@/components/ui/separator"


export default function UpdateCamionModal({ open, onOpenChange, camion, setReload }) {
  const router = useRouter()

  const [data, setData] = useState({ marqueId: '', immatriculation: '', libelle: '' })
  const [errors, setErrors] = useState({ marqueId: '', immatriculation: '', libelle: '' })

  const [marques, setMarques] = useState([])

  // get marques
  const retriveMarques = async () => {
    try {
      const response = await axiosInstance.get(apiRoutes.allMarqueCamion)
      console.log("Response de recuperation des marques :", response.data)
      return response.data
    } catch (error) {
      console.log("error lors de la recuperation des marques :", error)
    }
  }

  useEffect(() => {
    if (!camion) return
    setData({ marqueId: camion.marqueId, immatriculation: camion.immatriculation, libelle: camion.libelle || '' })
  }, [camion])

  useEffect(() => {
    try {
      toast.promise(
        retriveMarques(),
        {
          loading: `Chargement des marques de camions...`,
          success: (data) => {
            console.log("Response de recuperation des marque camions:", data)
            setMarques(data || [])
            return 'Marques de camions chargées avec succès!'
          },
          error: (err) => "Erreure lors du chargement des marques de camions",
        }
      )
    } catch (error) {
      console.log("Erreur catchée :", error)
    }
  }, [])

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  // handle role selection
  const handleSelect = (marqueId) => {
    console.log("La marque selectionnée :", marqueId)
    setData((prev) => ({ ...prev, marqueId }))
  }

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.updateCamion(camion.id), data),
        {
          loading: `Mise à jour en cours du camion ${camion?.immatriculation}...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            // redirection
            setReload(true)
            router.push(routes.camion?.list)
            router.refresh()
            onOpenChange(false)
            return 'Camion modifié.e avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 402) {
              const validationErrors = err.response.data?.errors
              const { marqueId, immatriculation, libelle } = validationErrors
              setErrors({
                marqueId: marqueId?._errors[0],
                immatriculation: immatriculation?._errors[0],
                libelle: libelle?._errors[0],
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
            <PencilLine /> Modifier le camion
            <span className="badge bg-light rounded border text-dark">{camion?.immatriculation}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier ce camion.
          </DialogDescription>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12">
            <Label htmlFor="marqueId">Choisissez une marque</Label>
            <FilterSelect
              options={marques?.map((marque) => ({ id: marque.id, label: marque.name }))}
              handleSelect={handleSelect}
              selected={data?.marqueId}
            />
            {errors.marqueId && <span className="text-center">{errors.marqueId}</span>}
          </div>
          <Separator className="my-2" />
          <div className="col-md-12 mb-2">
            <Label htmlFor="immatriculation">Immatriculation  <span className="text-danger">*</span></Label>
            <Input id="immatriculation"
              type="text"
              name="immatriculation"
              autoFocus
              required
              value={data.immatriculation}
              onChange={handleChange} />
            {errors.immatriculation && <span className="text-danger">{errors.immatriculation}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="libelle">Libellé  </Label>
            <Input id="libelle"
              type="text"
              name="libelle"
              placeholder="Ex: Camion Poids lourd"
              value={data.libelle}
              onChange={handleChange} />
            {errors.libelle && <span className="text-danger">{errors.libelle}</span>}
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