'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { List, MessageSquarePlus, SquareArrowRightEnter, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"


import { useApp } from "@/app/AppContext"
import { useRouter } from "next/navigation"
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import routes from "@/app/routes"

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import Link from "next/link";

export default function index() {
    const { user, loading, setLoading } = useApp()
    const router = useRouter()

    const [permissions, setPermissions] = useState([])
    const [rolePermissions, setRolePermissions] = useState([])

    const [data, setData] = useState({ name: '', description: '', permissionIds: [] })
    const [errors, setErrors] = useState({ name: '', description: '', permissionIds: '' })

    const [search, setSearch] = useState('')

    const isPermittedTo = (name) => {
        return user?.role?.permissions?.some((pr) => pr.name == name)
    }

    // Charge toutes les permissions
    useEffect(() => {
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
    }, [])

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

    // submition
    const submitForm = (e) => {
        // console.log("apiRoutes : ",apiRoutes)
        e.preventDefault()
        toast.promise(
            () => axiosInstance.post(apiRoutes.createRole, data),
            {
                loading: `Creétion du rôle en cours ...`,
                success: (res) => {
                    console.log("Response de creation :", res.data)

                    router.push(routes.role?.list)//redirection vers la list
                    // router.refresh() // 👈 recharge les données server-side sans full reload

                    return 'Rôle crée avec succès!'
                },
                error: (err) => {
                    console.log("Erreure complète :", err.response)

                    if (err?.response?.status === 402) {
                        const validationErrors = err.response.data?.errors
                        const { name, description, permissionIds } = validationErrors
                        setErrors({
                            name: name?._errors[0],
                            description: description?._errors[0],
                            permissionIds: permissionIds?._errors[0],
                        })
                        return err.response.data?.error || 'Erreurs de validation, vérifiez le formulaire.'
                    }

                    return err?.response?.data?.error || err?.message || "Erreur de mise à jour de l'utilisateur"
                },
            }
        )
    }

    return <>
        <DashboardLayourt title="Création des rôles" icon={<MessageSquarePlus />}>
            {/* listes des roles */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    {isPermittedTo("role.create") ?
                        <div className="col-md-10">
                            <div className="flex justify-content-center">
                                <Link className="btn btn-md border shadow-sm rounded p-1 d-flex w-50 justify-content-center align-items-center mb-2" href={routes.role.list}><List className="mx-1" /> Liste des rôles</Link>
                            </div>
                            <form onSubmit={submitForm} className="shadow-sm border rounded p-2 bg-white">
                                <div className="row">
                                    <div className="col-md-12 mb-2">
                                        <Label htmlFor="name">Nom <span className="text-danger">*</span></Label>
                                        <Input id="name"
                                            name="name"
                                            autoFocus
                                            placeholder="Ex: Suivi commande"
                                            required
                                            value={data.name}
                                            onChange={handleChange} />
                                        {errors.name && <span className="text-danger">{errors.name}</span>}
                                    </div>
                                    <div className="col-md-12 mb-2">
                                        <Label htmlFor="description">Description <span className="text-danger">*</span> </Label>
                                        <Textarea id="description"
                                            name="description"
                                            rows={1}
                                            value={data.description}
                                            placeholder="Rôle des suveurs de commande"
                                            onChange={handleChange} />
                                        {errors.description && <span className="text-danger">{errors.description}</span>}
                                    </div>
                                </div>

                                <Separator />

                                {/* les permissions */}
                                <div className="row">
                                    <div className="col-12">
                                        <h6 className="text-center my-2">Toutes les permissions</h6>
                                        {errors.permissions && <span className="text-danger">{errors.permissions}</span>}
                                        <div className="m-3">
                                            <Input
                                                type="search"
                                                placeholder="Rechercher une permission..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>

                                        <div className="overflow-y-auto max-h-[90vh]">
                                            {!loading ? (
                                                filteredPermissions.map((per) => (
                                                    <FieldGroup key={per.id} className="max-w-sm">
                                                        <Field orientation="horizontal">
                                                            <Checkbox
                                                                id={`perm-${per.id}`}
                                                                // ✅ calculé dynamiquement depuis rolePermissions
                                                                checked={rolePermissions?.some((rp) => rp.id === per.id)}
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
                                </div>

                                <div className="d-flex justify-content-center bg-light p-3">
                                    <Button className="shadow-sm rounded" variant="outline" onClick={(e) => (e.preventDefault(), router.push(routes.role?.list))} > <X /> Retour</Button>
                                    <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
                                </div>
                            </form>
                        </div> :
                        <p className="text-center text-danger">Vous n'êtes pas autorisé.e à acceder à cette page.</p>
                    }
                </div>
            </div >
        </DashboardLayourt >
    </>
}