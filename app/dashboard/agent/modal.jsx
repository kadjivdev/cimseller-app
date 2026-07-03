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


export default function UpdateAgentModal({ open, onOpenChange, agent, setReload }) {
  const router = useRouter()

  const [data, setData] = useState({ nom: '', prenom: '', phone: '' })
  const [errors, setErrors] = useState({ nom: '', prenom: '', phone: '' })

  useEffect(() => {
    if (!agent) return
    setData({ nom: agent.nom, prenom: agent.prenom, phone: agent.phone })
  }, [agent])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.updateAgent(agent.id), data),
        {
          loading: `Mise à jour en cours de l'agent ${agent?.nom}...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            // redirection
            setReload(true)
            router.push(routes.agent?.list)
            router.refresh()
            onOpenChange(false)
            return 'Agent modifié.e avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 402) {
              const validationErrors = err.response.data?.errors
              const { name, description } = validationErrors
              setErrors({
                name: name?._errors[0],
                description: description?._errors[0],
              })
              return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
            }

            return err?.response?.data?.message || err?.message || "Erreur de mise à jour de l'utilisateur"
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
            <PencilLine /> Modifier l'agent
            <span className="badge bg-light rounded border text-dark">{agent?.nom}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier cet agent.
          </DialogDescription>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12 mb-2">
            <Label htmlFor="fullname">Nom  <span className="text-danger">*</span></Label>
            <Input id="nom"
              type="text"
              name="nom"
              autoFocus
              required
              value={data.nom}
              onChange={handleChange} />
            {errors.nom && <span className="text-danger">{errors.nom}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="fullname">Prénom  <span className="text-danger">*</span></Label>
            <Input id="prenom"
              type="text"
              name="prenom"
              required
              value={data.prenom}
              onChange={handleChange} />
            {errors.prenom && <span className="text-danger">{errors.prenom}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="fullname">Télephone  <span className="text-danger">*</span></Label>
            <Input id="phone"
              type="text"
              name="phone"
              required
              value={data.phone}
              onChange={handleChange} />
            {errors.phone && <span className="text-danger">{errors.phone}</span>}
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