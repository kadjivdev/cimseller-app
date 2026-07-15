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
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"


export default function UpdateReglementModal({ open, onOpenChange, reglement, setReload }) {
  const router = useRouter()

  const [detailRecuTypes, setDetailRecuTypes] = useState([])
  const [ventes, setVentes] = useState([])
  const [clients, setClients] = useState([])
  const [compteBancaires, setCompteBancaires] = useState([])

  const [data, setData] = useState({ typeDetailRecuId: '', venteId: '', clientId: '', compteBancaireId: '', reference: '', montant: '', deblocDette: false, date: '', preuve: '', comment: '' })
  const [errors, setErrors] = useState({ typeDetailRecuId: '', venteId: '', clientId: '', compteBancaireId: '', reference: '', montant: '', deblocDette: '', date: '', preuve: '', comment: '' })

  useEffect(() => {
    if (!reglement) return
    setData({
      typeDetailRecuId: reglement.typeDetailRecuId,
      venteId: reglement.venteId,
      clientId: reglement.clientId,
      compteBancaireId: reglement.compteBancaireId,
      reference: reglement.reference,
      montant: reglement.montant,
      date: reglement.date?.split("T")?.[0],
      deblocDette: reglement.deblocDette,
      preuve: null,
      comment: reglement.comment
    })
  }, [reglement])

  // initialisation des erreurs
  useEffect(() => {
    if (!open) return

    // Charge tous les types de detail recu
    toast.promise(
      () => axiosInstance.get(apiRoutes.allDetailRecuTypes),
      {
        loading: 'Chargement des types de detail reçus  ...',
        success: (res) => {
          console.log("Les types de details :", res.data)
          setDetailRecuTypes(res.data || [])
          return 'Types chargés!'
        },
        error: (err) => err?.message || 'Erreur de chargement',
      }
    )

    // Charge toutes les ventes validées
    toast.promise(
      () => axiosInstance.get(apiRoutes.allValidatedVente),
      {
        loading: 'Chargement des ventes validées ...',
        success: (res) => {
          console.log("Les ventes :", res.data)
          setVentes(res.data || [])
          return 'Ventes chargées!'
        },
        error: (err) => err?.data?.error || 'Erreur de chargement',
      }
    )

    // Charge tous les clients actifs
    toast.promise(
      () => axiosInstance.get(apiRoutes.allActifClient),
      {
        loading: 'Chargement des clients ...',
        success: (res) => {
          console.log("Les clients :", res.data)
          setClients(res.data || [])
          return 'Clients chargés!'
        },
        error: (err) => err?.message || 'Erreur de chargement',
      }
    )

    // Charge tous les compte bancaire
    toast.promise(
      () => axiosInstance.get(apiRoutes.allCompteBancaire),
      {
        loading: 'Chargement des comptes bancaires ...',
        success: (res) => {
          console.log("Les compte bancaires :", res.data)
          setCompteBancaires(res.data || [])
          return 'Compte bancaires chargés!'
        },
        error: (err) => err?.message || 'Erreur de chargement',
      }
    )

    setErrors({
      typeDetailRecuId: '', venteId: '', clientId: '', deblocDette: '', compteBancaireId: '', reference: '', montant: '', date: '', preuve: '', comment: ''
    })
  }, [open])

  // handle change
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] ?? null : value,
    }));
  };

  // handle vente selection
  const handleVenteSelect = (venteId) => {
    console.log("La vente selectionnée :", venteId)
    setData((prev) => ({ ...prev, venteId: venteId }))
  }

  // handle type selection
  const handleTypeDetailRecuSelect = (typeDetailRecuId) => {
    console.log("Le type de détail reçu selectionné :", typeDetailRecuId)
    setData((prev) => ({ ...prev, typeDetailRecuId: typeDetailRecuId }))
  }

  // handle client selection
  const handleClientSelect = (clientId) => {
    console.log("Le clientId selectionné :", clientId)
    setData((prev) => ({ ...prev, clientId: clientId }))
  }

  // handle compte bancaire selection
  const handleCompteBancaireSelect = (compteBancaireId) => {
    console.log("Le compteBancaireId selectionné :", compteBancaireId)
    setData((prev) => ({ ...prev, compteBancaireId: compteBancaireId }))
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
        axiosInstance.put(apiRoutes.updateReglement(reglement.id), data),
        {
          loading: `Mise à jour en cours du reglement ${reglement?.code} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            // redirection
            setReload(true)
            router.push(routes.reglement?.list)
            router.refresh()
            onOpenChange(false)
            return 'Reglement modifié avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 402) {
              const validationErrors = err.response.data?.errors
              const { typeDetailRecuId, venteId, clientId, compteBancaireId, reference, montant, date, preuve, comment } = validationErrors
              setErrors({
                typeDetailRecuId: typeDetailRecuId?._errors?.[0],
                venteId: venteId?._errors?.[0],
                clientId: clientId?._errors?.[0],
                compteBancaireId: compteBancaireId?._errors?.[0],
                reference: reference?._errors?.[0],
                montant: montant?._errors?.[0],
                date: date?._errors?.[0],
                preuve: preuve?._errors?.[0],
                comment: comment?._errors?.[0]
              })
              return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
            }

            return err?.response?.data?.error || err?.message || "Erreur de mise à jour de l'reglement"
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
            <PencilLine /> Modifier du reglement
            <span className="badge bg-light rounded border text-dark">{reglement?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier ce reglement.
          </DialogDescription>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12 mb-2">
            <Label htmlFor="reference">Reference  <span className="text-danger">*</span></Label>
            <Input id="reference"
              type="text"
              name="reference"
              autoFocus
              required
              value={data.reference}
              onChange={handleChange} />
            {errors.reference && <span className="text-danger">{errors.reference}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="montant">Montant <span className="text-danger">*</span> </Label>
            <Input id="montant"
              type="number"
              name="montant"
              required
              value={data.montant}
              onChange={handleChange} />
            {errors.montant && <span className="text-danger">{errors.montant}</span>}
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
            <Label htmlFor="venteId">Vente <span className="text-danger">*</span>  </Label>
            <FilterSelect
              options={ventes?.map((v) => ({ id: v.id, label: v.code }))}
              handleSelect={handleVenteSelect}
              selected={data?.venteId}
            />
            {errors.venteId && <span className="text-danger">{errors.venteId}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="clientId">Client <span className="text-danger">*</span>  </Label>
            <FilterSelect
              options={clients?.map((clt) => ({ id: clt.id, label: clt.raison_sociale }))}
              handleSelect={handleClientSelect}
              selected={data?.clientId}
            />
            {errors.clientId && <span className="text-danger">{errors.clientId}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="clientId">Compte bancaire <span className="text-danger">*</span>  </Label>
            <FilterSelect
              options={compteBancaires?.map((cb) => ({ id: cb.id, label: `${cb.intitule} - ${cb.numero}` }))}
              handleSelect={handleCompteBancaireSelect}
              selected={data?.compteBancaireId}
            />
            {errors.compteBancaireId && <span className="text-danger">{errors.compteBancaireId}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="typeDetailRecuId">Type de reçu <span className="text-danger">*</span>  </Label>
            <FilterSelect
              options={detailRecuTypes?.map((dr) => ({ id: dr.id, label: dr.name }))}
              handleSelect={handleTypeDetailRecuSelect}
              selected={data?.typeDetailRecuId}
            />
            {errors.typeDetailRecuId && <span className="text-danger">{errors.typeDetailRecuId}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Field>
              <FieldLabel htmlFor="image">Preuve</FieldLabel>
              <Input
                id="preuve"
                type="file"
                name="preuve"
                onChange={(e) => handleChange(e)}
              />
            </Field>
            {errors.preuve && <span className="text-danger">{errors.preuve}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Field orientation="horizontal">
              <Checkbox
                id="deblocDette"
                name="deblocDette"
                checked={data.deblocDette}
                onCheckedChange={(checked) =>
                  setData((prev) => ({
                    ...prev,
                    deblocDette: checked,
                  }))
                }
              />
            </Field>
            <FieldContent>
              <FieldLabel htmlFor="deblocDette">
                Contourner la dette
              </FieldLabel>
              <FieldDescription>
                En cliquant, vous acceptez d'éffectuer le règlement qaund bien même le client a une dette.
              </FieldDescription>
            </FieldContent>
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="comment">Commentaire  </Label>
            <Textarea
              rows={1}
              placeholder="Ex: Laissez un commentaire ..."
              id="comment"
              name="comment"
              value={data.comment}
              onChange={handleChange}
            ></Textarea>
            {errors.comment && <span className="text-danger">{errors.comment}</span>}
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