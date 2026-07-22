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
import { PencilLine, SquareArrowRightEnter, Trash2, X } from "lucide-react";
import { Field } from "@/components/ui/field"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function AddProgrammationModal({ open, onOpenChange, bon, handleBonSelect }) {
  const router = useRouter()

  const [data, setData] = useState({ commandeId: "", zoneId: '', camionId: '', chauffeurId: '', avaliseurId: '', dateProgrammation: '', qteProgrammer: '', observation: '' })
  const [errors, setErrors] = useState({ commandeId: "", zoneId: '', camionId: '', chauffeurId: '', avaliseurId: '', dateProgrammation: '', qteProgrammer: '', observation: '' })

  const [avaliseurs, setAvaliseurs] = useState([])
  const [camions, setCamions] = useState([])
  const [zones, setZones] = useState([])
  const [chauffeurs, setChauffeurs] = useState([])

  // initialisation des erreurs
  useEffect(() => {
    if (!open) return
    if (!bon) return

    // Charge les avaliseurs
    toast.promise(
      () => axiosInstance.get(apiRoutes.allAvaliseur),
      {
        loading: 'Chargement des avaliseurs ...',
        success: (res) => {
          console.log("L'avaliseur :", res.data)
          setAvaliseurs(res.data)
          return 'Avaliseurs chargés!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement'
        },
      }
    )

    // Charge les camions
    toast.promise(
      () => axiosInstance.get(apiRoutes.allCamion),
      {
        loading: 'Chargement des camions ...',
        success: (res) => {
          console.log("Les camions :", res.data)
          setCamions(res.data)
          return 'Camions chargés!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement'
        },
      }
    )

    // Charge les chauffeurs
    toast.promise(
      () => axiosInstance.get(apiRoutes.allChauffeur),
      {
        loading: 'Chargement des chauffeurs ...',
        success: (res) => {
          console.log("Les chauffeurs :", res.data)
          setChauffeurs(res.data)
          return 'Chauffeurs chargés!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement'
        },
      }
    )

    // Charge les zones
    toast.promise(
      () => axiosInstance.get(apiRoutes.allZone),
      {
        loading: 'Chargement des zones ...',
        success: (res) => {
          console.log("Les zones :", res.data)
          setZones(res.data)
          return 'Zones chargées!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement'
        },
      }
    )

    setErrors({
      commandeId: "", zoneId: '', camionId: '', chauffeurId: '', avaliseurId: '', dateProgrammation: '', qteProgrammer: '', observation: ''
    })
  }, [open])

  // handle avaliseur selection
  const handleAvaliseurSelect = (avaliseurId) => {
    console.log("L'avaliseur selectionné :", avaliseurId)
    setData((prev) => ({ ...prev, avaliseurId }))
  }

  // handle camion selection
  const handleCamionSelect = (camionId) => {
    console.log("Le camion selectionné :", camionId)
    setData((prev) => ({ ...prev, camionId }))
  }

  // handle chauffeur selection
  const handleChauffeurSelect = (chauffeurId) => {
    console.log("Le chauffeur selectionné :", chauffeurId)
    setData((prev) => ({ ...prev, chauffeurId }))
  }

  // handle zone selection
  const handleZoneSelect = (zoneId) => {
    console.log("La zone selectionnée :", zoneId)
    setData((prev) => ({ ...prev, zoneId }))
  }

  // handleChange
  const handleChange = (e) => {
    e.preventDefault()
    let { value, checked, files, type, name } = e.target
    setData((prev) => ({
      ...prev,
      commandeId: bon?.id,
      [name]: type === "file"
        ? files?.[0] ?? null
        : type === "checkbox"
          ? checked
          : value,
    }))
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
        axiosInstance.post(apiRoutes.createProgrammation, data),
        {
          loading: `Programmation du bon ${bon?.code} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            router.push(routes.programmation?.list)
            router.refresh()
            handleBonSelect(bon.id)
            onOpenChange(false)

            return `Programmation insérée avec succès!`
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 422) {
              const validationErrors = err.response.data?.errors
              const { commandeId, zoneId, camionId, chauffeurId, avaliseurId, dateProgrammation, qteProgrammer, observation } = validationErrors
              setErrors({
                commandeId: commandeId?._errors?.[0],
                zoneId: zoneId?._errors?.[0] || '',
                camionId: camionId?._errors?.[0] || '',
                chauffeurId: chauffeurId?._errors?.[0] || '',
                avaliseurId: avaliseurId?._errors?.[0] || '',
                dateProgrammation: dateProgrammation?._errors?.[0] || '',
                qteProgrammer: qteProgrammer?._errors?.[0] || '',
                observation: observation?._errors?.[0] || '',
              })
              return err.response.data?.message || `Erreurs de validation pour l'insertion des reçus, vérifiez le formulaire.`
            }

            return err?.response?.data?.error || "Erreure d'insersion de la programmation"
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
            <PencilLine />Programmation du bon
            <span className="badge mx-1 bg-dark rounded border text-white"> {bon?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour programmer ce bon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitUpdateForm}>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="qteProgrammer">Date de programmation <span className="text-danger">*</span>  </Label>
                <Input id="dateProgrammation"
                  type="date"
                  name="dateProgrammation"
                  required
                  value={data.dateProgrammation}
                  onChange={handleChange} />
                {errors?.dateProgrammation && <span className="text-danger">{errors?.dateProgrammation}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="qteProgrammer">Quantité à programmer <span className="text-danger">*</span>  </Label>

                <Input id="qteProgrammer"
                  type="number"
                  name="qteProgrammer"
                  placeholder="Ex: 15.0"
                  required
                  min={1}
                  value={data.qteProgrammer}
                  onChange={(e) => {
                    let value = Number(e.target.value)
                    setData((prev) => ({ ...prev, qteProgrammer: value }))
                  }} />
                {errors?.qteProgrammer && <span className="text-danger">{errors?.qteProgrammer}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="avaliseurId">Choisissez un avaliseur <span className="text-danger">*</span>  </Label>
                <FilterSelect
                  options={avaliseurs?.map((av) => ({ id: av.id, label: `${av.fullname}` }))}
                  handleSelect={handleAvaliseurSelect}
                  selected={data?.avaliseurId}
                />
                {errors?.avaliseurId && <span className="text-danger">{errors?.avaliseurId}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="camionId">Choisissez un camion <span className="text-danger">*</span>  </Label>
                <FilterSelect
                  options={camions?.map((cm) => ({ id: cm.id, label: `${cm.immatriculation} - ${cm.libelle}` }))}
                  handleSelect={handleCamionSelect}
                  selected={data?.camionId}
                />
                {errors?.camionId && <span className="text-danger">{errors?.camionId}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="chauffeurId">Choisissez un chauffeur <span className="text-danger">*</span>  </Label>
                <FilterSelect
                  options={chauffeurs?.map((cf) => ({ id: cf.id, label: `${cf.fullname}` }))}
                  handleSelect={handleChauffeurSelect}
                  selected={data?.chauffeurId}
                />
                {errors?.chauffeurId && <span className="text-danger">{errors?.chauffeurId}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="zoneId">Choisissez une zone <span className="text-danger">*</span>  </Label>
                <FilterSelect
                  options={zones?.map((zn) => ({ id: zn.id, label: `${zn.name}` }))}
                  handleSelect={handleZoneSelect}
                  selected={data?.zoneId}
                />
                {errors?.zoneId && <span className="text-danger">{errors?.zoneId}</span>}
              </div>
            </div>

            <div className="col-md-12">
              <div className="mb-2">
                <Textarea
                  name="observation"
                  onChange={handleChange}
                  placeholder="Laissez un commantaire" />
                {errors?.observation && <span className="text-danger">{errors?.observation}</span>}
              </div>
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