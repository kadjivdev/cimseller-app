// modal-collaborateur.tsx  ← juste le modal
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Checkbox } from "@/components/ui/checkbox"
import { useApp } from "@/app/AppContext"
import { toast } from "sonner"
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import routes from "@/app/routes"
import { SquareArrowRightEnter, X } from "lucide-react"

export default function UpdateRoleModal({ open, onOpenChange, role, setReload }) {
  const { loading, setLoading } = useApp()
  const router = useRouter()

  const [permissions, setPermissions] = useState([])
  const [rolePermissions, setRolePermissions] = useState([])
  const [data, setData] = useState({ name: '', description: '', permissionIds: [] })
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!role) return
    setData({ name: role.name, description: role.description, permissionIds: [] })
  }, [role])

  // Récupère le rôle avec ses permissions
  useEffect(() => {
    if (!open || !role?.id) return
    toast.promise(
      () => axiosInstance.get(apiRoutes.retrieveRole(role.id)),
      {
        loading: `Chargement du rôle ${role?.name}...`,
        success: (res) => {
          setData({ name: res.data.name, description: res.data.description, permissionIds: res.data?.permissions?.map((per) => (per.id)) })
          setRolePermissions(res.data.permissions || [])
          setLoading(false)
          return 'Rôle chargé!'
        },
        error: (err) => err?.message || 'Erreur de chargement',
      }
    )
  }, [open, role?.id])

  // Charge toutes les permissions
  useEffect(() => {
    if (!open) return
    toast.promise(
      () => axiosInstance.get(apiRoutes.allPermission),
      {
        loading: 'Chargement des permissions...',
        success: (res) => {
          setPermissions(res.data || [])
          setLoading(false)
          return 'Permissions chargées!'
        },
        error: (err) => err?.message || 'Erreur de chargement',
      }
    )
  }, [open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  // ✅ toggle propre sans duplication
  const handlePermissionSelection = (permission, checked) => {
    setRolePermissions((prev) =>
      checked
        ? [...prev, permission]
        : prev.filter((rp) => rp.id !== permission.id)
    )
  }

  // ✅ filtre sans toucher au state
  const filteredPermissions = permissions.filter((per) =>
    per.name.toLowerCase().includes(search.toLowerCase())
  )

  // gestion des consoles
  useEffect(() => {
    console.log("Role permissions :", rolePermissions)
    setData((prev) => ({ ...prev, permissionIds: rolePermissions.map((per) => (per.id)) }))
  }, [rolePermissions])

  useEffect(() => {
    console.log("Updated data :", data)
  }, [data])


  // submittion
  const submitUpdateForm = (e) => {
    e.preventDefault()
    toast.promise(
      () => axiosInstance.put(apiRoutes.updateRole(role.id), data),
      {
        loading: `Mise à jour en cours du rôle ${role?.name}...`,
        success: (res) => {
          console.log("Response de mise à jour :", res.data)
          // router.push(routes.role?.list)//redirection sur la page des roles

          router.push(routes.role?.list)
          router.refresh() // 👈 recharge les données server-side sans full reload
          setReload(true)

          // fermeture du modal
          onOpenChange(false)
          // 
          return 'Rôle modifié avec succès!'
        },
        error: (err) => err?.message || 'Erreur de chargement',
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            Modifier le rôle{' '}
            <span className="badge bg-light rounded border text-dark">{role?.name}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour modifier ce rôle.
          </DialogDescription>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12 mb-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" autoFocus required value={data.name} onChange={handleChange} />
          </div>
          <div className="col-md-12 mb-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={1} value={data.description} onChange={handleChange} />
          </div>
        </div>

        <Separator />

        <div className="row">
          <div className="col-12">
            <h6 className="text-center my-2">Toutes les permissions</h6>
            <div className="m-3">
              <Input
                type="search"
                placeholder="Rechercher une permission..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {!loading ? (
              filteredPermissions.map((per) => (
                <FieldGroup key={per.id} className="max-w-sm">
                  <Field orientation="horizontal">
                    <Checkbox
                      id={`perm-${per.id}`}
                      // ✅ calculé dynamiquement depuis rolePermissions
                      checked={rolePermissions.some((rp) => rp.id === per.id)}
                      onCheckedChange={(checked) => handlePermissionSelection(per, checked)}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={`perm-${per.id}`}>
                        <strong><em>{per.name}</em></strong>
                      </FieldLabel>
                      <FieldDescription>{per.description}</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldGroup>
              ))
            ) : (
              <div className="text-center"><Spinner /> ...</div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button className="shadow-sm rounded" variant="outline" onClick={() => onOpenChange(false)}><X /> Annuler</Button>
          <Button type="submit" className="bg-dark text-white shadow-sm rounded" onClick={submitUpdateForm}><SquareArrowRightEnter /> Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}