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
import { PencilLine } from "lucide-react";

export default function VersementRecuBonModal({ open, onOpenChange, recu }) {

  const [versements, setVersements] = useState([])
  // initialisation des erreurs
  useEffect(() => {
    if (!open) return

    // Charge le recu
    toast.promise(
      () => axiosInstance.get(apiRoutes.retrieveCommandeRecu(recu?.id)),
      {
        loading: 'Chargement du recu ...',
        success: (res) => {
          setVersements(res.data?.versements || [])
          console.log("Le recu :", res.data)
          return 'Recu chargé!'
        },
        error: (err) => {
          onOpenChange(false)
          return err?.response?.error || err?.message || 'Erreur de chargement'
        },
      }
    )
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[800px] sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="bg-light p-1">
          <DialogTitle>
            <PencilLine /> Liste des versements du bon
            <span className="badge mx-1 bg-light rounded border text-dark">{recu?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Détails des reçus à ce bon.
          </DialogDescription>
        </DialogHeader>


      </DialogContent>
    </Dialog >
  )
}