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
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"

export default function DeliveryProgrammationModal({ open, onOpenChange, programmation, handleBonSelect }) {
  const router = useRouter()

  const [data, setData] = useState({ programId: '', dateLivraison: '', qteLivre: '', newBl: '', preuve: '', livraisonComment: '' })
  const [errors, setErrors] = useState({ programId: '', dateLivraison: '', qteLivre: '', newBl: '', preuve: '', livraisonComment: '' })

  // initialisation des erreurs
  useEffect(() => {
    if (!open) return
    if (!programmation) return

    console.log("La programmation :", programmation)

    setData((prev) => ({
      ...prev,
      programId: programmation?.id,
      qteLivre:
        programmation?.statut?.id == 4 ?//livrée
          programmation.qteLivre : programmation.stock || 0,
      dateLivraison: programmation?.dateLivraison?.split("T")?.[0] || '',
      newBl: programmation.bl || '',
      preuve: '',
      livraisonComment: '',
    }))

    setErrors({
      qteLivre: '', dateLivraison: '', newBl: '', preuve: '', livraisonComment: ''
    })
  }, [open, programmation])

  // handleChange
  const handleChange = (e) => {
    e.preventDefault()
    let { value, checked, files, type, name, max } = e.target

    if (name == "qteLivre" && value > max) {
      toast.error(`Le stock maximum est de ${max} Tonne(s)`)
      setData((prev) => ({
        ...prev, qteLivre: max
      }))
      return
    }

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
    const formData = new FormData()
    formData.append("programId", data.programId)
    formData.append("qteLivre", data.qteLivre)
    formData.append("dateLivraison", data.dateLivraison)
    formData.append("newBl", data.newBl)
    formData.append("livraisonComment", data.livraisonComment)

    if (data.preuve instanceof File) {
      formData.append("preuve", data.preuve)
    }

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.livraisonProgrammation, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
        {
          loading: `Livraison de la programmation ${programmation?.code} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            router.push(routes.livraison?.list)
            router.refresh()
            handleBonSelect(programmation?.commandeId)
            onOpenChange(false)

            return `Programmation livrée avec succès!`
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 422) {
              const validationErrors = err.response.data?.errors
              const { qteLivre, dateLivraison, newBl, preuve, livraisonComment } = validationErrors
              setErrors({
                qteLivre: qteLivre?._errors?.[0] || '',
                dateLivraison: dateLivraison?._errors?.[0] || '',
                newBl: newBl?._errors?.[0] || '',
                preuve: preuve?._errors?.[0] || '',
                livraisonComment: livraisonComment?._errors?.[0] || ''
              })
              return err.response.data?.message || `Erreurs de validation de la livraison`
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
            <PencilLine />Livraison de la programmation
            <span className="badge mx-1 bg-dark rounded border text-white"> {programmation?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour livrer la programmation de ce bon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitUpdateForm}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="dateLivraison">Date de livraison <span className="text-danger">*</span> </Label>
                <Input id="dateLivraison"
                  type="date"
                  name="dateLivraison"
                  readOnly={programmation?.dateLivraison}
                  value={data.dateLivraison}
                  required
                  onChange={handleChange} />
                {errors?.dateLivraison && <span className="text-danger">{errors?.dateLivraison}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="qteLivre">Qte à livrer <span className="text-danger">*</span> </Label>
                <Input id="qteLivre"
                  type="number"
                  name="qteLivre"
                  max={programmation?.stock}
                  value={data.qteLivre}
                  required
                  readOnly={programmation?.stock==0}
                  onChange={handleChange} />
                {errors?.qteLivre && <span className="text-danger">{errors?.qteLivre}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="bl">Bl <span className="text-danger">*</span> </Label>
                <Input id="newBl"
                  type="text"
                  name="newBl"
                  placeholder="Ex: 15654543"
                  readOnly={true}
                  value={data.newBl}
                  required
                  onChange={handleChange} />
                {errors?.newBl && <span className="text-danger">{errors?.newBl}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="col-md-12">
                <div className="mb-2">
                  <Textarea
                    name="livraisonComment"
                    value={data.livraisonComment}
                    onChange={handleChange}
                    placeholder="Laissez un commantaire" />
                  {errors?.livraisonComment && <span className="text-danger">{errors?.livraisonComment}</span>}
                </div>
              </div>
            </div>
            <div className="col-md-12 mb-2">
              <Field>
                <FieldLabel htmlFor="preuve">Preuve Bl <span className="text-danger">*</span> </FieldLabel>
                <Input
                  id="preuve"
                  type="file"
                  name="preuve"
                  onChange={(e) => handleChange(e)}
                />
              </Field>
              {errors.preuve && <span className="text-danger">{errors.preuve}</span>}
            </div>
          </div>

          <DialogFooter>
            <Button className="shadow-sm rounded" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Annuler</Button>
            <Button
              type="submit"
              className="bg-dark text-white shadow-sm rounded"
              disabled={programmation?.stock == 0}
            ><SquareArrowRightEnter /> Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
