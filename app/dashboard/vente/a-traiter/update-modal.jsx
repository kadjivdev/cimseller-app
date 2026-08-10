"use client"

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { toast } from "sonner"
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import { useRouter } from "next/navigation"
import { PencilLine, Send, X } from "lucide-react";
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function UpdateVenteModal({ open, onOpenChange, vente, setReload }) {
  const router = useRouter()

  const [data, setData] = useState({ aib: 0, tva: 0, ttcPrice: 0, marge: 0, })
  const [errors, setErrors] = useState({ aib: '', tva: '', ttcPrice: '', marge: '' })

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target

    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // submission
  const updateVenteForm = async (e) => {
    e.preventDefault()

    try {
      await toast.promise(
        axiosInstance.post(apiRoutes.createComptabilities, { venteId: vente?.id }),
        {
          loading: `Envoie en comptabilité de la vente ${vente?.code} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            setReload(true)
            // router.push(routes.vente?.aComptabiliser)
            router.refresh()
            onOpenChange(false)

            return `Vente envoyée à la comptabilité avec succès!`
          },
          error: (err) => {
            console.log("Erreur complète :", err.response?.data)
            return err?.response?.data?.error || "Erreure d'insersion de la vente"
          },
        }
      )
    } catch (error) {
      console.log("Erreur catchée :", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[800px] sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="bg-light p-1">
          <DialogTitle>
            <PencilLine />Traitement de la vente
            <span className="badge mx-1 bg-dark rounded border text-white"> {vente?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Le traiteent sera définitif et irréversible!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={updateVenteForm}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="unitePrice">Prix TTC <span className="text-danger">*</span>  </Label>
                <Input id="ttcPrice"
                  type="number"
                  name="ttcPrice"
                  placeholder="Ex: 75000"
                  required
                  min={1}
                  value={data.ttcPrice}
                  onChange={handleChange} />
                {errors?.ttcPrice && <span className="text-danger">{errors?.ttcPrice}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="tva">TVA <span className="text-danger">*</span>  </Label>
                <Input id="tva"
                  type="number"
                  name="tva"
                  placeholder="Ex: 18/100"
                  required
                  min={1}
                  max={data?.tva}
                  value={data.tva}
                  onChange={handleChange} />
                {errors?.tva && <span className="text-danger">{errors?.tva}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="aib">AIB <span className="text-danger">*</span>  </Label>
                <Input id="aib"
                  type="number"
                  name="aib"
                  placeholder="Ex: 10000"
                  required
                  min={0}
                  value={data.aib}
                  onChange={handleChange} />
                {errors?.aib && <span className="text-danger">{errors?.aib}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="marge">Marge <span className="text-danger">*</span>  </Label>
                <Input id="marge"
                  type="number"
                  name="marge"
                  placeholder="Ex: 10000"
                  required
                  min={0}
                  value={data.marge}
                  onChange={handleChange} />
                {errors?.marge && <span className="text-danger">{errors?.marge}</span>}
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-content-center">
            <Button className="shadow-sm rounded bg-dark text-white" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Annuler</Button>
            <Button
              type="submit"
              className="bg-success text-white shadow-sm rounded"
            ><Send /> Envoyer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
