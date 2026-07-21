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
import { PencilLine, SquareArrowRightEnter, Trash2, X } from "lucide-react";
import { FilterSelect } from "@/myComponents/FilterSelect"

export default function UpdateBonModal({ open, onOpenChange, bon, setReload }) {
  const router = useRouter()

  const [types, setTypes] = useState([])
  const [produits, setProduits] = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [data, setData] = useState({ reference: "", typeId: '', fournisseurId: '', date: '', details: [{ productId: 1, qteCommande: 0, unitePrice: 0, remise: 0 }] })
  const [errors, setErrors] = useState({ reference: "", typeId: '', fournisseurId: '', date: '', details: [] })

  useEffect(() => {
    if (!bon) return
  })

  // initialisation des erreurs
  useEffect(() => {
    if (!open) return

    // Charge tous les types de bon
    toast.promise(
      () => axiosInstance.get(apiRoutes.allCommandeTypes),
      {
        loading: 'Chargement des types de bons de commande ...',
        success: (res) => {
          console.log("Les types :", res.data)
          setTypes(res.data || [])
          return 'Types chargés!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement des types de bon'
        },
      }
    )

    // Charge tous les produits
    toast.promise(
      () => axiosInstance.get(apiRoutes.allProduit),
      {
        loading: 'Chargement des produits ...',
        success: (res) => {
          console.log("Les produits :", res.data)
          setProduits(res.data || [])
          return 'Produits chargés!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement des produits'
        },
      }
    )

    // Charge tous les fournisseurs de bon
    toast.promise(
      () => axiosInstance.get(apiRoutes.allFournisseur),
      {
        loading: 'Chargement des fournisseurs ...',
        success: (res) => {
          console.log("Les fournisseurs :", res.data)
          setFournisseurs(res.data || [])
          return 'Fournisseurs chargés!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement des fournisseurs'
        },
      }
    )

    // Charge la commande
    toast.promise(
      () => axiosInstance.get(apiRoutes.retrieveCommande(bon?.id)),
      {
        loading: 'Chargement du bon ...',
        success: (res) => {
          console.log("Le bon :", res.data)
          setData((prev) => ({
            ...prev,
            reference: res.data?.reference,
            typeId: res.data?.typeId,
            fournisseurId: res.data?.fournisseurId,
            date: res.data?.date?.split("T")?.[0],
            details: res.data?.commandeDetails ? [...res.data?.commandeDetails.map((cd) => ({ productId: cd.productId ?? 1, qteCommande: cd.qteCommande ?? 0, unitePrice: cd.unitePrice ?? 0, remise: cd.remise ?? 0 }))] : [{ productId: '', qteCommande: 0, unitePrice: 0, remise: 0 }]
          }))
          return 'Bon chargé!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement'
        },
      }
    )

    setErrors({
      reference: '', typeId: '', fournisseurId: '', date: '', details: [{ productId: '', qteCommande: '', unitePrice: "", remise: "" }]
    })
  }, [open])

  useEffect(() => {

    setData((prev) => (
      {
        ...prev,
        reference: bon?.reference,
        typeId: bon?.typeId,
        fournisseurId: bon?.fournisseurId,
        date: bon?.date?.split("T")?.[0],
      }))
  }, [bon])

  // handle change
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] ?? null : value,
    }));
  };

  // handle type selection
  const handleTypeSelect = (typeId) => {
    console.log("Le type selectionné :", typeId)
    setData((prev) => ({ ...prev, typeId: typeId }))
  }

  // handle product selection for a detail row
  const handleProduitSelect = (index, productId) => {
    console.log("Le produit selectionné :", productId, "ligne", index)
    setData((prev) => ({
      ...prev,
      details: prev.details.map((detail, idx) =>
        idx === index ? { ...detail, productId } : detail
      ),
    }))
  }

  // handle fournisseur selection
  const handleFournisseurSelect = (fournisseurId) => {
    console.log("Le fournisseurId selectionné :",)
    setData((prev) => ({ ...prev, fournisseurId: fournisseurId }))
  }

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    console.log("data state :", data)

    // ✅ construit un vrai FormData pour multer
    const formData = new FormData()
    formData.append('name', data.name)

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }
    console.log("formData :", formData)

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.updateCommande(bon?.id), data),
        {
          loading: `Mise à jour en cours du bon ${bon?.code} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            // redirection
            setReload(true)
            router.push(routes.bonCommande?.list)
            router.refresh()
            onOpenChange(false)
            return 'Bon modifié avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 422) {
              const validationErrors = err.response.data?.errors
              const { reference, typeId, fournisseurId, date, details } = validationErrors
              setErrors({
                reference: reference?._errors?.[0],
                typeId: typeId?._errors?.[0],
                fournisseurId: fournisseurId?._errors?.[0],
                date: date?._errors?.[0],
                details: details?._errors?.[0],
              })
              return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
            }

            return err?.response?.data?.error || err?.message || "Erreur de mise à jour du bon"
          },
        }
      )
    } catch (error) {
      console.log("Erreur catchée :", error)
    }
  }

  // addLigne
  const addLigne = (e) => {
    e.preventDefault()
    setData((prev) => ({
      ...prev,
      details: [...data.details, { productId: '', qteCommande: 0, unitePrice: 0, remise: 0 }]
    }))
  }

  // removeLigne
  const removeLigne = (e, index) => {
    e.preventDefault()
    if (data.details?.length == 1) return
    setData((prev) => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx != index)
    }))
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
        <DialogHeader>
          <DialogTitle>
            <PencilLine /> Modifier du bon
            <span className="badge bg-light rounded border text-dark">{bon?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier ce bon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitUpdateForm}>
          <div className="row">
            <div className="col-md-12 mb-2">
              <Label htmlFor="reference">Reference <span className="text-danger">*</span> </Label>
              <Input id="date"
                type="text"
                name="reference"
                placeholder="Ex: GFTR56SR89"
                required
                value={data.reference}
                onChange={handleChange} />
              {errors.reference && <span className="text-danger">{errors.reference}</span>}
            </div>
            <div className="col-md-12 mb-2">
              <Label htmlFor="montant">Date <span className="text-danger">*</span> </Label>
              <Input id="date"
                type="date"
                name="date"
                required
                value={data.date}
                onChange={handleChange} />
              {errors.date && <span className="text-danger">{errors.date}</span>}
            </div>
            <div className="col-md-12 mb-2">
              <Label htmlFor="fournisseurId">Fournisseur <span className="text-danger">*</span>  </Label>
              <FilterSelect
                options={fournisseurs?.map((fr) => ({ id: fr.id, label: fr.raison_sociale }))}
                handleSelect={handleFournisseurSelect}
                selected={data?.fournisseurId}
              />
              {errors.fournisseurId && <span className="text-danger">{errors.fournisseurId}</span>}
            </div>
            <div className="col-md-12 mb-2">
              <Label htmlFor="typeId">Type de Commande <span className="text-danger">*</span>  </Label>
              <FilterSelect
                options={types?.map((tp) => ({ id: tp.id, label: tp.name }))}
                handleSelect={handleTypeSelect}
                selected={data?.typeId}
              />
              {errors.typeId && <span className="text-danger">{errors.typeId}</span>}
            </div>
          </div>

          <br /><br />
          {/* les détails */}
          <div className="row">
            <div className="col-md-12">
              <div className="flex justify-between items-center">
                <h5>Les détails</h5>
                <button
                  className="px-3 py-1 text-sm bg-neutral-900 text-white rounded shadow-sm hover:bg-neutral-800"
                  onClick={(e) => addLigne(e)}>
                  ➕ Ajouter
                </button>
              </div>
              {/* {errors.details && <span className="text-danger">{errors.details}</span>} */}

              {/*  */}
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">N°</th>
                    <th scope="col">Produit</th>
                    <th scope="col">Quantité</th>
                    <th scope="col">Prix Unitaire</th>
                    <th scope="col">Remise</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.details?.map((dt, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <th scope="row">
                          <FilterSelect
                            options={produits?.map((pd) => ({ id: pd.id, label: pd.name }))}
                            handleSelect={(value) => handleProduitSelect(index, value)}
                            selected={dt?.productId}
                          />
                          {errors.details?.[0]?.productId && <span className="text-danger">{errors.details?.[0]?.productId}</span>}
                        </th>
                        <td>
                          <Input id="qteCommande"
                            type="number"
                            name="qteCommande"
                            placeholder="Ex: 15.0"
                            required
                            value={dt.qteCommande}
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              setData((prev) => ({
                                ...prev,
                                details: prev.details.map((detail, idx) =>
                                  idx === index
                                    ? { ...detail, qteCommande: isNaN(value) ? 0 : value }
                                    : detail
                                ),
                              }))
                            }} />
                          {errors.details?.[0]?.qteCommande && <span className="text-danger">{errors.details?.[0]?.qteCommande}</span>}
                        </td>
                        <td>
                          <Input id="unitePrice"
                            type="number"
                            name="unitePrice"
                            placeholder="Ex: 75.000"
                            required
                            value={dt.unitePrice}
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              setData((prev) => ({
                                ...prev,
                                details: prev.details.map((detail, idx) =>
                                  idx === index
                                    ? { ...detail, unitePrice: isNaN(value) ? 0 : value }
                                    : detail
                                ),
                              }))
                            }}
                          />
                          {errors.details?.[0]?.unitePrice && <span className="text-danger">{errors.details?.[0]?.unitePrice}</span>}
                        </td>
                        <td>
                          <Input id="remise"
                            type="number"
                            name="remise"
                            placeholder="Ex: 1.000"
                            required
                            value={dt.remise}
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              setData((prev) => ({
                                ...prev,
                                details: prev.details.map((detail, idx) =>
                                  idx === index
                                    ? { ...detail, remise: isNaN(value) ? 0 : value }
                                    : detail
                                ),
                              }))
                            }}
                          />
                          {errors.details?.[0]?.remise && <span className="text-danger">{errors.details?.[0]?.remise}</span>}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm bg-danger text-white border rounded"
                            onClick={(e) => removeLigne(e, index)}><Trash2 /></button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter>
            <Button className="shadow-sm rounded" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Annuler</Button>
            <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}