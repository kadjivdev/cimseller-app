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
import { Field, FieldLabel } from "@/components/ui/field"


export default function UpdateClientModal({ open, onOpenChange, client, setReload,zones,status }) {
  const router = useRouter()

  const [data, setData] = useState({ zoneId: '', statutId: '', raison_sociale: '', profil: '', phone: '', email: '', adresse: '' })
  const [errors, setErrors] = useState({ zoneId: '', statutId: '', raison_sociale: '', profil: '', phone: '', email: '', adresse: '' })

  useEffect(() => {
    if (!client) return
    setData({ zoneId: client.zoneId, statutId: client.statutId, raison_sociale: client.raison_sociale, profil: '', phone: client.phone, email: client.email, adresse: client.adresse })
  }, [client])


  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] ?? null : value,
    }));
  };

  // handle statut selection
  const handleStatutSelect = (statutId) => {
    console.log("Le statutId selectionné :", statutId)
    setData((prev) => ({ ...prev, statutId: statutId }))
  }

  // handle zone selection
  const handleZoneSelect = (zoneId) => {
    console.log("Le zoneId selectionné :", zoneId)
    setData((prev) => ({ ...prev, zoneId: zoneId }))
  }

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    console.log("data state :", data)

    // ✅ construit un vrai FormData pour multer
    const formData = new FormData()
    formData.append('zoneId', data.zoneId)
    formData.append('statutId', data.statutId)
    formData.append('phone', data.phone)
    formData.append('email', data.email)
    formData.append('raison_sociale', data.raison_sociale)
    formData.append('adresse', data.adresse)

    if (data.image instanceof File) {
      formData.append("profil", data.profil);
    }

    console.log("formData :", formData)

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.updateClient(client.id), data),
        {
          loading: `Mise à jour en cours du produit ${client?.raison_sociale}...`,
          success: async (data) => {
            console.log("Response de mise à jour à succès:", data)

            // redirection
            setReload(true)
            // router.push(routes.client?.list)
            router.refresh()
            onOpenChange(false)
            return 'Client modifié.e avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 402) {
              const validationErrors = err.response.data?.errors
              const { zoneId, statutId, raison_sociale, phone, profil, email } = validationErrors
              
              setErrors({
                zoneId: zoneId?._errors?.[0],
                statutId: statutId?._errors?.[0],
                raison_sociale: raison_sociale?._errors?.[0],
                phone: phone?._errors?.[0],
                profil: profil?._errors?.[0],
                email: email?._errors[0],
                adresse: adresse?._errors?.[0],
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
            <PencilLine /> Modifier le client
            <span className="badge bg-light rounded border text-dark">{client?.raison_sociale}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier ce client.
          </DialogDescription>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12 mb-2">
            <Label htmlFor="raison_sociale">Raison sociale  <span className="text-danger">*</span></Label>
            <Input id="raison_sociale"
              type="text"
              name="raison_sociale"
              autoFocus
              required
              value={data.raison_sociale}
              onChange={handleChange} />
            {errors.raison_sociale && <span className="text-danger">{errors.raison_sociale}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="phone">Téléphone </Label>
            <Input id="phone"
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange} />
            {errors.phone && <span className="text-danger">{errors.phone}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="email">Email </Label>
            <Input id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange} />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="adresse">Adresse </Label>
            <Input id="adresse"
              type="adresse"
              name="adresse"
              value={data.adresse}
              onChange={handleChange} />
            {errors.adresse && <span className="text-danger">{errors.adresse}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="description">Zone  <span className="text-danger">*</span>  </Label>
            <FilterSelect
              options={zones?.map((zone) => ({ id: zone.id, label: zone.name }))}
              handleSelect={handleZoneSelect}
              selected={data?.zoneId}
            />
            {errors.zoneId && <span className="text-danger">{errors.zoneId}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="description">Statut  <span className="text-danger">*</span>  </Label>
            <FilterSelect
              options={status?.map((statut) => ({ id: statut.id, label: statut.name }))}
              handleSelect={handleStatutSelect}
              selected={data?.statutId}
            />
            {errors.statutId && <span className="text-danger">{errors.statutId}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Field>
              <FieldLabel htmlFor="profil">Profil</FieldLabel>
              <Input
                id="profil"
                type="file"
                name="profil"
                onChange={(e) => handleChange(e)}
              />
            </Field>
            {errors.profil && <span className="text-danger">{errors.profil}</span>}
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