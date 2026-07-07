"use client"

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

// import { useApp } from "@/app/AppContext"
import { toast } from "sonner"
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import { useRouter } from "next/navigation"
import routes from "@/app/routes"
import { Import, SquareArrowRightEnter, X } from "lucide-react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { ChevronRight, ChevronDown } from "lucide-react"

export default function ImportUserModal({ open, onOpenChange, setReload }) {

  const router = useRouter()

  const [data, setData] = useState({ users: '' })
  const [errors, setErrors] = useState({ users: '' })

  const handleChange = (e) => {
    e.preventDefault()
    console.log("Fichier uploaded :", e.target.files?.[0])

    setData((prev) => ({ ...prev, users: e.target.files?.[0] }))
  }

  // submission
  const submitImportForm = async (e) => {
    e.preventDefault()

    // ✅ construit un vrai FormData pour multer
    const formData = new FormData()
    formData.append('users', data.users) // data.users est le File

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.importUser, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }, // ✅ important
        }),
        {
          loading: `Importation en cours ...`,
          success: async (res) => {
            console.log("Response de l'importation à succès:", res.data)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            router.push(routes.user?.list)
            router.refresh() // 👈 recharge les données server-side sans full reload
            setReload(true)
            onOpenChange(false)
            return 'Importation effectué.e avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 402) {
              const validationErrors = err.response.data?.errors
              const { users } = validationErrors
              setErrors({ users: users?._errors[0] })
              return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
            }

            return err?.response?.data?.message || err?.message || "Erreur d'importation des utilisateurs"
          },
        }
      )
    } catch (error) {
      console.log("Erreur catchée :", error)
    }
  }

  // gestion des consoles
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
            <Import className="" /> Importation de compte utilisateurs
          </DialogTitle>
          <div className="alert alert-dark">
            <ul>
              <li>⏺️ Cliquer sur le boutton en bas pour télecharger le model </li>
              <li>⏺️ Remplissez le model suivant le format qui s'y trouve</li>
              <li>⏺️ Uploader le model après l'avoir rempli avec vos données</li>
            </ul>
          </div>
          <div className="d-flex justify-content-center">
            <a href="/users.xlsx" target="_blank"
              className="btn btn-sm d-flex w-50 border rounded bg-dark shadow-sm text-white"
              onClick={() => onOpenChange(true)}>
              <Import className="mx-1" /> Télecharger le model.
            </a>
          </div>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12 mb-2">
            <Field>
              <FieldLabel htmlFor="picture">Fichier excel</FieldLabel>
              <Input id="picture" type="file"
                onChange={(e) => handleChange(e)}
              />
              <FieldDescription> Choisissez le model excel à importer.</FieldDescription>
            </Field>
            {errors.users && <span className="text-danger">{errors.users}</span>}
          </div>
        </div>

        <DialogFooter>
          <Button className="shadow-sm rounded" variant="outline" onClick={() => onOpenChange(false)}><X /> Annuler</Button>
          <Button type="submit" className="bg-dark text-white shadow-sm rounded" onClick={submitImportForm}><SquareArrowRightEnter /> Importer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}