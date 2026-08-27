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
import { PencilLine} from "lucide-react";

import { DataTable } from "./reglement/data-table"

export default function ReglementsVenteModal({ open, onOpenChange, vente }) {
 
  const [reglements, setReglements] = useState([])

  // initialisation des erreurs
  useEffect(() => {
    if (!open) return
    if (!vente) return

    console.log("La vente :", vente)

    // Charge les zones
    toast.promise(
      () => axiosInstance.get(apiRoutes.retrieveVente(vente?.id)),
      {
        loading: 'Chargement de la vente ...',
        success: (res) => {
          console.log("La vente :", res.data)
          setReglements(res.data?.reglements || [])
          return 'Vente chargée!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement de la vente'
        },
      }
    )
  }, [open, vente])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[800px] sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="bg-light p-1">
          <DialogTitle>
            <PencilLine />Liste des règlmeents de la vente
            <span className="badge mx-1 bg-dark rounded border text-white"> {vente?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Sont affichés ici, les règlements de la vente concernées.
          </DialogDescription>
        </DialogHeader>

        {/* reglements */}
        <DataTable
          data={reglements}
        />
      </DialogContent>
    </Dialog >
  )
}
