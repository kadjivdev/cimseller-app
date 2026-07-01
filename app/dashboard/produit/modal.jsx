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
import { Field, FieldLabel } from "@/components/ui/field"


export default function UpdateProduitModal({ open, onOpenChange, produit, setReload }) {
  const router = useRouter()

  const [types, setTypes] = useState([])
  const [data, setData] = useState({ name: '', description: '', fournisseurPrice: '', typeId: '', image: '' })
  const [errors, setErrors] = useState({ name: '', description: '', fournisseurPrice: '', typeId: '', image: '' })

  useEffect(() => {
    if (!produit) return
    setData({ name: produit.name, description: produit.description ?? '', fournisseurPrice: produit.fournisseurPrice ?? 0, typeId: produit.type?.id ?? 0, image: '' })
  }, [produit])

  // Charge tous les type de produit
  useEffect(() => {
    if (!open) return
    toast.promise(
      () => axiosInstance.get(apiRoutes.allTypeProduit),
      {
        loading: 'Chargement des types de produit...',
        success: (res) => {
          setTypes(res.data || [])
          return 'Types de produit chargés!'
        },
        error: (err) => err?.message || 'Erreur de chargement',
      }
    )

    // initialisation des erreurs
    setErrors({
      name: '', description: '', fournisseurPrice: '', typeId: '', image: ''
    })
  }, [open])

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] ?? null : value,
    }));
  };

  // handle type selection
  const handleSelect = (type_id) => {
    console.log("Le type selectionné :", type_id)
    setData((prev) => ({ ...prev, typeId: type_id }))
  }

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    console.log("data state :", data)

    // ✅ construit un vrai FormData pour multer
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('fournisseurPrice', data.fournisseurPrice)
    formData.append('typeId', data.typeId)

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    console.log("formData :", formData)

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.updateProduit(produit.id), formData),
        {
          loading: `Mise à jour en cours du produit ${produit?.name}...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            // redirection
            setReload(true)
            router.push(routes.produit?.list)
            router.refresh()
            onOpenChange(false)
            return 'Produit modifié.e avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 402) {
              const validationErrors = err.response.data?.errors
              const { name, description, fournisseurPrice, typeId, image } = validationErrors
              setErrors({
                name: name?._errors[0],
                description: description?._errors[0],
                fournisseurPrice: fournisseurPrice?._errors[0],
                typeId: typeId?._errors[0],
                image: image?._errors[0],
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
            <PencilLine /> Modifier le produit
            <span className="badge bg-light rounded border text-dark">{produit?.name}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier ce produit.
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
            <Label htmlFor="fournisseurPrice">Prix du forunisseur </Label>
            <Input id="fournisseurPrice"
              type="number"
              name="fournisseurPrice"
              value={data.fournisseurPrice}
              onChange={handleChange} />
            {errors.fournisseurPrice && <span className="text-danger">{errors.fournisseurPrice}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="description">Type de produit <span className="text-danger">*</span>  </Label>
            <FilterSelect
              options={types?.map((type) => ({ id: type.id, label: type.name }))}
              handleSelect={handleSelect}
              selected={data?.typeId}
            />
            {errors.typeId && <span className="text-danger">{errors.typeId}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Field>
              <FieldLabel htmlFor="image">Image produit</FieldLabel>
              <Input
                id="image"
                type="file"
                name="image"
                onChange={(e) => handleChange(e)}
              />
            </Field>
            {errors.image && <span className="text-danger">{errors.image}</span>}
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