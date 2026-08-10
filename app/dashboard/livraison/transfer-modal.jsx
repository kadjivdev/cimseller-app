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
import { FilterSelect } from "@/myComponents/FilterSelect"
import { Textarea } from "@/components/ui/textarea"

export default function TransfertProgrammationModal({ open, onOpenChange, programmation, handleBonSelect }) {
  const router = useRouter()

  const [zones, setZones] = useState([])
  const [data, setData] = useState({ programId: '', date: '', qteReste: 0, zoneDest: '', observation: '' })
  const [errors, setErrors] = useState({ programId: '', date: '', qteReste: '', zoneDest: '', observation: '' })

  // initialisation des datas
  useEffect(() => {
    if (!open) return
    if (!programmation) return

    console.log("La programmation :", programmation)

    // Chargement des zones
    toast.promise(
      () => axiosInstance.get(apiRoutes.allZone),
      {
        loading: 'Chargement des zones ...',
        success: (res) => {
          console.log("Les zones :", res.data)
          setZones(res.data)
          return 'Zones chargées avec succès!'
        },
        error: (err) => err?.response?.message || 'Erreur de chargement des zones',
      }
    )

    // initialisation des data
    setData((prev) => ({
      ...prev,
      programId: programmation?.id,
      zoneDest: programmation?.transferts?.at(-1)?.zoneDest || programmation?.zoneId,
      date: programmation?.transferts?.at(-1)?.date?.split("T")?.[0] || new Date().toISOString().split("T")?.[0],
      qteReste: programmation?.transferts?.at(-1)?.qteReste || programmation?.qteProgrammer,
      observation: programmation?.transferts?.at(-1)?.observation || ''
    }))

    setErrors({
      date: '', qteReste: '', zoneDest: '', observation: ''
    })
  }, [open, programmation])

  // handle zone selection
  const handleZoneSelect = (zoneDest) => {
    console.log("La zoneDest selectionnée :", zoneDest)

    setData((prev) => ({
      ...prev,
      zoneDest: zoneDest
    }))
  }

  // handleChange
  const handleChange = (e) => {
    e.preventDefault()
    let { value, checked, files, type, name } = e.target
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
  const submitTransfertForm = async (e) => {
    e.preventDefault()

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.transfertProgrammation, data),
        {
          loading: `Transfert de la programmation ${programmation?.code} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            router.push(routes.livraison?.list)
            router.refresh()
            handleBonSelect(programmation?.commandeId)
            onOpenChange(false)

            return `Programmation transférée avec succès!`
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 422) {
              const validationErrors = err.response.data?.errors
              const { programId, date, qteReste, zoneDest, observation } = validationErrors
              setErrors({
                date: date?._errors?.[0] || '',
                qteReste: qteReste?._errors?.[0] || '',
                zoneDest: zoneDest?._errors?.[0] || '',
                observation: observation?._errors?.[0] || '',
              })
              return err.response.data?.message || `Erreurs de validation pour l'insertion des reçus, vérifiez le formulaire.`
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
            <PencilLine />Transfert de la programmation
            <span className="badge mx-1 bg-dark rounded border text-white"> {programmation?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour transferer la programmation de ce bon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitTransfertForm}>

          {programmation?.transferts?.length > 0 &&
            <div className="flex justify-content-center mb-3">
              <span className="badge bg-success text-light  p-3">Déjà transféré vers la zone : <strong className="text-uppercase bg-light text-dark p-2 rounded shadow-sm">{programmation?.transferts?.at(-1)?.zoneDestination?.name}</strong> </span>
            </div>
          }

          <div className="row">
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="zoneSource">Zone source <span className="text-danger">*</span>  </Label>
                <Input id="zoneSource"
                  type="text"
                  name="zoneSource"
                  required
                  readOnly={true}
                  value={programmation?.transferts?.at(-1)?.zoneSource?.name || programmation?.zone?.name} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="zoneDest">Choisissez la zone de destination <span className="text-danger">*</span>  </Label>
                <FilterSelect
                  options={zones?.map((zn) => ({ id: zn.id, label: `${zn.name}` }))}
                  handleSelect={handleZoneSelect}
                  selected={data?.zoneDest}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="date">Date du transfert <span className="text-danger">*</span> </Label>
                <Input id="date"
                  type="date"
                  name="date"
                  required
                  readOnly={data.date}
                  value={data.date}
                  onChange={handleChange} />
                {errors?.date && <span className="text-danger">{errors?.date}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="qteReste">Qte restante <span className="text-danger">*</span> </Label>
                <Input id="qteReste"
                  type="number"
                  name="qteReste"
                  required
                  readOnly={data.qteReste}
                  value={data.qteReste}
                  onChange={handleChange} />
                {errors?.qteReste && <span className="text-danger">{errors?.qteReste}</span>}
              </div>
            </div>
            <div className="col-md-12">
              <div className="mb-2">
                <Label htmlFor="observation">Observation </Label>
                <Textarea
                  name="observation"
                  value={data.observation}
                  onChange={handleChange}
                  placeholder="Laissez un commentaire concernant le transfert"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button className="shadow-sm rounded" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Annuler</Button>
            <Button
              type="submit"
              className="bg-dark text-white shadow-sm rounded"
              disabled={programmation?.qteProgrammer ==programmation?.qteLivre}
            ><SquareArrowRightEnter /> Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
