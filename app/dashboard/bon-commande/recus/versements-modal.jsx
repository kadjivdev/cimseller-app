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
import { Eye, PencilLine, SquareArrowRightEnter, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation"
import { FilterSelect } from "@/myComponents/FilterSelect"
import { Field } from "@/components/ui/field"
import routes from "@/app/routes"
import Link from "next/link"

export default function VersementRecuBonModal({ open, onOpenChange, recu, setReload }) {
  const router = useRouter()

  const [typesDetailRecus, setTypesDetailRecus] = useState([])
  const [comptes, setComptes] = useState([])

  const [data, setData] = useState({ recuId: "", versements: [{ reference: '', compteId: '', typeDetailRecuId: '', date: '', montant: 1, preuve: '' }] })
  const [errors, setErrors] = useState({ recuId: '', versements: '' })

  // initialisation des erreurs
  useEffect(() => {
    if (!open) return

    // Charge les types de detail reçu de command
    toast.promise(
      () => axiosInstance.get(apiRoutes.allDetailRecuTypes),
      {
        loading: 'Chargement des types de détail reçu ...',
        success: (res) => {
          setTypesDetailRecus(res.data || [])
          return 'Types chargés!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement'
        },
      }
    )

    // Charge les comptes
    toast.promise(
      () => axiosInstance.get(apiRoutes.allCompteBancaire),
      {
        loading: 'Chargement des comptes bancaires ...',
        success: (res) => {
          setComptes(res.data || [])
          return 'Comptes chargés!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement'
        },
      }
    )

    // Charge le recu
    toast.promise(
      () => axiosInstance.get(apiRoutes.retrieveCommandeRecu(recu?.id)),
      {
        loading: 'Chargement du recu ...',
        success: (res) => {
          console.log("Le recu chargé :",res.data)
          setData((prev) => ({
            ...prev,
            recuId: res.data?.id,
            versements: res.data?.versements?.length > 0 ?
              [...res.data?.versements?.map((vs) => ({ code: vs.code, reference: vs.reference, compteId: vs.compteId, typeDetailRecuId: vs.typeDetailRecuId, date: vs.date.split("T")?.[0], montant: vs.montant, preuve: vs.preuve }))] :
              [{ code: '', reference: '', compteId: '', typeDetailRecuId: '', date: '', montant: 1, preuve: '' }]
          }))
          return 'Recu chargé!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement'
        },
      }
    )
  }, [open])

  // ✅ handler centralisé pour tous les champs simples d'une ligne de versement
  const handleChange = (index, field, value) => {
    setData((prev) => ({
      ...prev,
      versements: prev.versements.map((v, idx) =>
        idx === index ? { ...v, [field]: value } : v
      ),
    }))
  }

  // handle type selection
  const handleTypeSelect = (index, typeDetailRecuId) => {
    handleChange(index, 'typeDetailRecuId', typeDetailRecuId)
  }

  // handle compte selection
  const handleCompteSelect = (index, compteId) => {
    handleChange(index, 'compteId', compteId)
  }

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('recuId', data.recuId)

    // on retire les Files du JSON (ils partent séparément) et on stringifie le reste
    const versementsSansFichiers = data.versements.map(({ preuve, ...rest }) => rest)
    formData.append('versements', JSON.stringify(versementsSansFichiers))

    // chaque fichier est nommé par son index pour être retrouvé côté serveur
    data.versements.forEach((v, index) => {
      if (v.preuve instanceof File) {
        formData.append(`preuve_${index}`, v.preuve)
      }
    })

    try {
      await toast.promise(
        axiosInstance.post(apiRoutes.createCommandeRecuVersement, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
        {
          loading: `Insertion des versements au bon ${recu?.code} ...`,
          success: async (res) => {
            setReload((prev) => prev + 1)
            onOpenChange(false)
            return `Versements insérés avec succès!`
          },
          error: (err) => {
            if (err?.response?.status === 422) {
              const validationErrors = err.response.data?.errors
              const { recuId, versements } = validationErrors
              setErrors({
                recuId: recuId?._errors?.[0],
                versements: versements?._errors?.[0],
              })
              return err.response.data?.message || `Erreurs de validation pour l'insertion des versements, vérifiez le formulaire.`
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
      versements: [...prev.versements, { reference: '', compteId: 1, typeDetailRecuId: 1, date: '', montant: 1, preuve: '' }]
    }))
  }

  // removeLigne
  const removeLigne = (e, index) => {
    e.preventDefault()
    if (data.versements?.length == 1) return
    setData((prev) => ({
      ...prev,
      versements: prev.versements.filter((_, idx) => idx != index)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[10000px] sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="bg-light p-1">
          <DialogTitle>
            <PencilLine /> Liste des versements du reçu
            <span className="badge mx-1 bg-dark rounded border text-white">{recu?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Versements à ce reçu.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitUpdateForm}>

          {errors.versements && <p className="text-center text-danger">{errors.versements}</p>}

          {/* les versements */}
          <div className="row">
            <div className="col-md-12">
              <div className="flex justify-between items-center">
                <h5>Les versements</h5>
                <button
                  className="px-3 py-1 text-sm bg-neutral-900 text-white rounded shadow-sm hover:bg-neutral-800"
                  onClick={(e) => addLigne(e)}>
                  ➕ Ajouter
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">N°</th>
                    <th scope="col">Code</th>
                    <th scope="col">Reference</th>
                    <th scope="col">Compte</th>
                    <th scope="col">Type de recu</th>
                    <th scope="col">Date</th>
                    <th scope="col">Montant</th>
                    <th scope="col">Preuve</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.versements?.map((dt, index) => (
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
                        {errors.versements?.[0]?.reference && <span className="text-danger">{errors.versements?.[0]?.reference}</span>}
                      </td>
                      <td>
                        <FilterSelect
                          options={comptes?.map((cp) => ({ id: cp.id, label: `${cp.intitule} - ${cp.numero}` }))}
                          handleSelect={(value) => handleCompteSelect(index, value)}
                          selected={dt?.compteId}
                        />
                        {errors.versements?.[0]?.compteId && <span className="text-danger">{errors.versements?.[0]?.compteId}</span>}
                      </td>
                      <td>
                        <FilterSelect
                          options={typesDetailRecus?.map((tp) => ({ id: tp.id, label: tp.name }))}
                          handleSelect={(value) => handleTypeSelect(index, value)}
                          selected={dt?.typeDetailRecuId}
                        />
                        {errors.versements?.[0]?.typeDetailRecuId && <span className="text-danger">{errors.versements?.[0]?.typeDetailRecuId}</span>}
                      </td>
                      <td>
                        <Input id="date"
                          type="date"
                          name="date"
                          required
                          value={dt.date}
                          onChange={(e) => handleChange(index, 'date', e.target.value)}
                        />
                        {errors.versements?.[0]?.date && <span className="text-danger">{errors.versements?.[0]?.date}</span>}
                      </td>
                      <td>
                        <Input id="montant"
                          type="number"
                          name="montant"
                          placeholder="Ex: 1.000"
                          required
                          min={1}
                          value={dt.montant}
                          onChange={(e) => {
                            const value = Number(e.target.value)
                            handleChange(index, 'montant', isNaN(value) ? 0 : value)
                          }}
                        />
                        {errors.versements?.[0]?.montant && <span className="text-danger">{errors.versements?.[0]?.montant}</span>}
                      </td>
                      <td className="d-flex">
                        {dt.preuve && typeof dt.preuve === 'string' &&
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
                        {errors.versements?.[0]?.preuve && <span className="text-danger">{errors.versements?.[0]?.preuve}</span>}
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
            <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}