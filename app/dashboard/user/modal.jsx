"use client"

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

import { useApp } from "@/app/AppContext"
import { toast } from "sonner"
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import routes from "@/app/routes"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { SquareArrowRightEnter, X } from "lucide-react";


export default function UpdateUserModal({ open, onOpenChange, user, setReload }) {
  const { user: contextUser, logout } = useApp()
  const router = useRouter()

  const [roles, setRoles] = useState([])
  const [data, setData] = useState({ fullname: '', email: '', roleId: '', password: '', confirm_password: '' })
  const [errors, setErrors] = useState({ fullname: '', email: '', roleId: '', password: '', confirm_password: '' })

  useEffect(() => {
    if (!user) return
    setData({ fullname: user.fullname, email: user.email, password: '', confirm_password: '', roleId: user.role?.id })
  }, [user])

  // Charge tous les roles
  useEffect(() => {
    if (!open) return
    toast.promise(
      () => axiosInstance.get(apiRoutes.allRole),
      {
        loading: 'Chargement des rôles...',
        success: (res) => {
          setRoles(res.data || [])
          return 'Rôles chargés!'
        },
        error: (err) => err?.message || 'Erreur de chargement',
      }
    )

    // initialisation des erreurs
    setErrors({
      fullname: '', email: '', roleId: '', password: '', confirm_password: ''
    })
  }, [open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  // submission
  const submitUpdateForm = async (e) => {
    e.preventDefault()

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.updateUser(user.id), data),
        {
          loading: `Mise à jour en cours de l'utilisateur ${user?.fullname}...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            await new Promise((resolve) => setTimeout(resolve, 2000))

            if (contextUser?.id == user?.id) {
              await toast.promise(
                logout(),
                {
                  loading: "Déconnexion en cours...",
                  success: () => {
                    router.push(routes.dashboard)
                    return "Compte mise à jour — Reconnectez-vous."
                  },
                  error: (err) => {
                    console.log(err.response?.message)
                  },
                })
            }

            // redirection
            setReload(true)
            onOpenChange(false)
            return 'Utilisateur modifié.e avec succès!'
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 402) {
              const validationErrors = err.response.data?.errors
              const { fullname, email, password, confirm_password, roleId } = validationErrors
              setErrors({
                fullname: fullname?._errors[0],
                email: email?._errors[0],
                password: password?._errors[0],
                confirm_password: confirm_password?._errors[0],
                roleId: roleId?._errors[0],
              })
              return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
            }

            return err?.response?.data?.message || err?.message || "Erreur de mise à jour de l'utilisateur"
          },
        }
      )

      // redirection
      router.push(routes.user?.list)
      setReload(true)
      onOpenChange(false)

    } catch (error) {
      console.log("Erreur catchée :", error)
    }
  }

  // handle role selection
  const handleSelect = (role_id) => {
    console.log("Le role selectionné :", role_id)
    setData((prev) => ({ ...prev, roleId: role_id }))
  }

  // gestion des consoles
  useEffect(() => {
    console.log("Role  :", roles)
  }, [roles])

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
            Modifier l'utilisateur
            <span className="badge bg-light rounded border text-dark">{user?.fullname}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier ce utilisateur.
          </DialogDescription>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12 mb-2">
            <Label htmlFor="fullname">Nom Complet <span className="text-danger">*</span></Label>
            <Input id="fullname"
              type="text"
              name="fullname"
              autoFocus
              required
              value={data.fullname}
              onChange={handleChange} />
            {errors.fullname && <span className="text-danger">{errors.fullname}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="email">Email <span className="text-danger">*</span> </Label>
            <Input id="email"
              name="email"
              autoFocus
              required
              value={data.email}
              onChange={handleChange} />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="password">Mot de passe <span className="text-danger">*</span></Label>
            <Input id="password"
              name="password"
              type="password"
              autoFocus
              required
              value={data.password}
              onChange={handleChange} />
            {errors.password && <span className="text-danger">{errors.password}</span>}

          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="confirm_password">Confirmer le mot de passe <span className="text-danger">*</span></Label>
            <Input id="confirm_password"
              type="password"
              name="confirm_password"
              autoFocus
              required
              value={data.confirm_password}
              onChange={handleChange} />
            {errors.confirm_password && <span className="text-danger">{errors.confirm_password}</span>}
          </div>
        </div>

        <Separator />

        <div className="row">
          <div className="col-md-12">
            <Label htmlFor="role_id">Choisissez un rôle</Label>
            <FilterSelect
              options={roles?.map((role) => ({ id: role.id, label: role.name }))}
              handleSelect={handleSelect}
              selected={data?.roleId}
            />
            {errors.roleId && <span className="text-center">{errors.roleId}</span>}
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