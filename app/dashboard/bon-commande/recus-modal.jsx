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
import { Eye, Plus, SquareArrowRightEnter, Trash2, X } from "lucide-react";
import { Field } from "@/components/ui/field"
import Link from "next/link"

export default function RecuBonModal({ open, onOpenChange, bon, setReload }) {

  const [data, setData] = useState({ commandeId: "", recus: [{ reference: '', libelle: "", date: '', tonnage: 1, montant: 1, preuve: '' }] })
  const [errors, setErrors] = useState({ commandeId: '', recus: '' })

  // initialisation des erreurs
  useEffect(() => {
    if (!open) return

    toast.promise(
      () => axiosInstance.get(apiRoutes.retrieveCommande(bon?.id)),
      {
        loading: 'Chargement du bon ...',
        success: (res) => {
          setData((prev) => ({
            ...prev,
            commandeId: res.data?.id,
            recus: res.data?.commandeRecus?.length > 0 ?
              [...res.data?.commandeRecus?.map((cr) => ({ code: cr.code, reference: cr.reference, libelle: cr.libelle, date: cr.date.split("T")?.[0], tonnage: cr.tonnage, montant: cr.montant, preuve: cr.preuve }))] :
              [{ code: '', reference: '', libelle: "", date: '', tonnage: 1, montant: 1, preuve: '' }]
          }))
          return 'Bon chargé!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement'
        },
      }
    )

    setErrors({ recus: '' })
  }, [open])

  // ✅ handler centralisé pour tous les champs simples d'une ligne de recu
  const handleChange = (index, field, value) => {
    setData((prev) => ({
      ...prev,
      recus: prev.recus.map((recu, idx) =>
        idx === index ? { ...recu, [field]: value } : recu
      ),
    }))
  }

  // ✅ handler dédié : tonnage recalcule automatiquement le montant
  const handleTonnageChange = (index, rawValue) => {
    const tonnage = Number(rawValue)
    const unitePrice = bon?.commandeDetails?.[0]?.unitePrice ?? 0
    const montant = (isNaN(tonnage) ? 0 : tonnage) * unitePrice

    setData((prev) => ({
      ...prev,
      recus: prev.recus.map((recu, idx) =>
        idx === index
          ? { ...recu, tonnage: isNaN(tonnage) ? 0 : tonnage, montant }
          : recu
      ),
    }))
  }

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('commandeId', data.commandeId)

    // on retire les Files du JSON (ils partent séparément) et on stringifie le reste
    const recusSansFichiers = data.recus.map(({ preuve, ...rest }) => rest)
    formData.append('recus', JSON.stringify(recusSansFichiers))

    // chaque fichier est nommé par son index pour être retrouvé côté serveur
    data.recus.forEach((recu, index) => {
      if (recu.preuve instanceof File) {
        formData.append(`preuve_${index}`, recu.preuve)
      }
    })

    try {
      await toast.promise(
        axiosInstance.post(apiRoutes.createCommandeRecu, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
        {
          loading: `Insertion des reçus au bon ${bon?.code} ...`,
          success: async (res) => {
            setReload((prev) => prev + 1)
            onOpenChange(false)
            return `Reçus insérés avec succès!`
          },
          error: (err) => {
            if (err?.response?.status === 422) {
              const validationErrors = err.response.data?.errors
              const { commandeId, recus } = validationErrors
              setErrors({
                commandeId: commandeId?._errors?.[0],
                recus: recus?._errors?.[0],
              })
              return err.response.data?.message || `Erreurs de validation pour l'insertion des reçus, vérifiez le formulaire.`
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
      recus: [...prev.recus, { reference: '', libelle: "", date: '', tonnage: 0, montant: 0, preuve: '' }]
    }))
  }

  // removeLigne
  const removeLigne = (e, index) => {
    e.preventDefault()
    if (data.recus?.length == 1) return
    setData((prev) => ({
      ...prev,
      recus: prev.recus.filter((_, idx) => idx != index)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[1000px] sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="bg-light p-1">
          <DialogTitle>
            <Plus /> Ajouter des reçus au bon
            <span className="badge mx-1 bg-dark rounded border text-white">{bon?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour ajouter des reçus à ce bon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitUpdateForm}>

          {errors.recus && <p className="text-center text-danger">{errors.recus}</p>}

          <div className="row">
            <div className="col-md-12">
              <div className="flex justify-between items-center">
                <h5>Les recus</h5>
                <button
                  className="px-3 py-1 text-sm bg-neutral-900 text-white rounded shadow-sm hover:bg-neutral-800"
                  onClick={(e) => addLigne(e)}
                  disabled={bon?.validatedBy}>
                  ➕ Ajouter
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">N°</th>
                    <th scope="col">Code</th>
                    <th scope="col">Reference</th>
                    <th scope="col">Libelle</th>
                    <th scope="col">Date</th>
                    <th scope="col">Tonnage</th>
                    <th scope="col">Montant</th>
                    <th scope="col">Preuve</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recus?.map((dt, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <th scope="row"><span className="badge bg-light border rounded text-dark">{dt.code || '--'}</span></th>
                      <td scope="row">
                        <Input id="reference"
                          type="text"
                          name="reference"
                          placeholder="Ex: XX00490"
                          required
                          value={dt.reference}
                          onChange={(e) => handleChange(index, 'reference', e.target.value)}
                        />
                        {errors.recus?.[0]?.reference && <span className="text-danger">{errors.recus?.[0]?.reference}</span>}
                      </td>
                      <td>
                        <Input id="libelle"
                          type="text"
                          name="libelle"
                          placeholder="Ex: ACHAT DE CIMENT NOCIBE 42.5 VRAC"
                          required
                          value={dt.libelle}
                          onChange={(e) => handleChange(index, 'libelle', e.target.value)}
                        />
                        {errors.recus?.[0]?.libelle && <span className="text-danger">{errors.recus?.[0]?.libelle}</span>}
                      </td>
                      <td>
                        <Input id="date"
                          type="date"
                          name="date"
                          required
                          value={dt.date}
                          onChange={(e) => handleChange(index, 'date', e.target.value)}
                        />
                        {errors.recus?.[0]?.date && <span className="text-danger">{errors.recus?.[0]?.date}</span>}
                      </td>
                      <td>
                        <Input id="tonnage"
                          type="number"
                          name="tonnage"
                          placeholder="Ex: 75"
                          required
                          min={1}
                          value={dt.tonnage}
                          onChange={(e) => handleTonnageChange(index, e.target.value)}
                        />
                        {errors.recus?.[0]?.tonnage && <span className="text-danger">{errors.recus?.[0]?.tonnage}</span>}
                      </td>
                      <td>
                        <Input id="montant"
                          type="number"
                          name="montant"
                          placeholder="Ex: 1.000"
                          required
                          readOnly
                          min={1}
                          value={dt.montant}
                        />
                        {errors.recus?.[0]?.montant && <span className="text-danger">{errors.recus?.[0]?.montant}</span>}
                      </td>
                      <td className="d-flex">
                        {dt.preuve &&
                          <Link target="_blank" href={dt.preuve} className="bg-light rounded border shadow-sm text-dark"><Eye /></Link>
                        }
                        <Field>
                          <Input
                            id="preuve"
                            type="file"
                            name="preuve"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null
                              handleChange(index, 'preuve', file)
                            }}
                          />
                        </Field>
                        {errors.recus?.[0]?.preuve && <span className="text-danger">{errors.recus?.[0]?.preuve}</span>}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm bg-danger text-white border rounded"
                          onClick={(e) => removeLigne(e, index)}><Trash2 /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter>
            <Button className="shadow-sm rounded" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Annuler</Button>
            <Button type="submit" disabled={bon?.validatedBy} className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}