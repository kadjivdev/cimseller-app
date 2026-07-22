'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import apiRoutes from "@/api/routes";
import { List, Printer, PrinterCheck } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { Label } from "@/components/ui/label"
import { SquareArrowRightEnter, X } from "lucide-react"

import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { DataTable } from "./data-table"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ImprimerProgrammationModal({ open, onOpenChange }) {
  const router = useRouter()

  const [data, setData] = useState({ fournisseurId: "", start: '', end: '' })
  const [errors, setErrors] = useState({ fournisseurId: "", start: '', end: '' })
  const [showLink, setShowLink] = useState(false)
  const [pdfLink, setPdfLink] = useState('')

  const [fournisseurs, setFournisseurs] = useState([])
  const [programmations, setProgrammations] = useState([])

  // filtres de données par poériode
  const [date, setDate] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })

  // initiation des dates
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      start: date?.from,
      end: date?.to
    }))
  }, [date])

  //Initialisation des données
  useEffect(() => {
    if (!open) return

    // les fournisseurs
    toast.promise(
      () => axiosInstance.get(apiRoutes.allFournisseur),
      {
        loading: 'Chargement des fournisseurs de bon ...',
        success: (res) => {
          console.log("Les fournisseurs imprimer:", res.data)
          // juste les programmations imprimées 
          setFournisseurs(res.data || [])//
          return 'Fournisseurs chargées!'
        },
        error: (err) => err?.response?.message || 'Erreur de chargement des fournisseurs',
      }
    )

    // Charge toutes les programmations validées
    toast.promise(
      () => axiosInstance.get(apiRoutes.allValidatedProgrammation),
      {
        loading: 'Chargement des programmations de bon ...',
        success: (res) => {
          console.log("Les programmations imprimer:", res.data)
          // juste les programmations imprimées 
          setProgrammations(res.data.filter((pr) => !pr.imprimer) || [])//
          return 'Programmations chargées!'
        },
        error: (err) => err?.response?.message || 'Erreur de chargement des programmations',
      }
    )
  }, [open])

  // Bons filtrés par période (recalculé automatiquement)
  let filteredProgrammations = useMemo(() => {
    if (!date?.from) return programmations

    const from = startOfDay(date.from)
    const to = date.to ? endOfDay(date.to) : endOfDay(date.from)

    let ps = programmations.filter((p) => {
      const createdAt = new Date(p.createdAt)
      console.log("Fournisseur :", p.commande?.fournisseur?.id == data.fournisseurId)
      return isWithinInterval(createdAt, { start: from, end: to }) &&
        p.commande?.fournisseur?.id == data.fournisseurId
    })

    return ps;
  }, [programmations, date, data])

  // handle fournisseur selection
  const handleFournisseurSelect = (fournisseurId) => {
    console.log("La commande selectionné :", fournisseurId)
    setData((prev) => ({
      ...prev,
      fournisseurId
    }))

    filteredProgrammations = filteredProgrammations.filter((p) => {
      return p.commande?.fournisseur?.id == data.fournisseurId
    })
  }

  useEffect(() => {
    console.log("programmations :", programmations)
  }, [programmations])

  useEffect(() => {
    console.log("Data :", data)
  }, [data])

  // ouvrir le pdf
  const openPdf = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/programmations/${data?.fournisseurId}/${data?.start}/${data?.end}/get-pdf`;
    window.open(url, '_blank');
  };

  // handlePrint
  const handlePrint = async (e) => {
    e.preventDefault()
    console.log("Les data à soumettre:", data)

    try {
      await toast.promise(
        axiosInstance.post(apiRoutes.printProgrammation, data),
        {
          loading: `Impression en cours ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)
            setShowLink(true)
            return `Impression éffectuée avec succès!`
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 422) {
              const validationErrors = err.response.data?.errors
              const { fournisseurId, start, end } = validationErrors
              setErrors({
                fournisseurId: fournisseurId?._errors?.[0],
                start: start?._errors?.[0] || '',
                end: end?._errors?.[0] || '',
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

  return <>
    {/* listes des programmations de commande */}
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="md:max-w-[1000px] sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="d-flex align-items-center g-2"><PrinterCheck />Impression des programmations</DialogTitle>
          <DialogDescription >
            Cette action est irréversible.
            {showLink && <Button onClick={openPdf} className="btn btn-sm btn-dark g-2 border rounded shado-sm d-flex align-items-center w-50"><PrinterCheck /> Télecharger les programmations imprimées</Button>}
          </DialogDescription>
        </DialogHeader>
        <Card className="p-2">
          <form onSubmit={handlePrint}>
            <div className="row d-flex justify-content-center">
              <div className="col-md-4">
                <Label htmlFor="fournisseur_id">Fournisseur <span className="text-danger">*</span>  </Label>
                <FilterSelect
                  options={fournisseurs?.map((fr) => ({ id: fr.id, label: `${fr.sigle} - ${fr.raison_sociale}` }))}
                  handleSelect={handleFournisseurSelect}
                  selected={data.fournisseurId}
                />
              </div>
            </div>

            <br />
            <DataTable
              data={filteredProgrammations}
              date={date}
              setDate={setDate}
            />
            <DialogFooter className="d-flex justify-content-center">
              <DialogClose asChild>
                <Button className="shadow-sm rounded" variant="outline" onClick={() => onOpenChange(false)}><X /> Annuler</Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-dark text-white shadow-sm rounded"
                disabled={filteredProgrammations?.length == 0}
              ><PrinterCheck />Imprimer</Button>
            </DialogFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog >
  </>
}