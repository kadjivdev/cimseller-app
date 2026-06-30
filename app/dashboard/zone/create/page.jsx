'use client'


import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Logs, SquareArrowRightEnter, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"


import { useApp } from "@/app/AppContext"
import { useRouter } from "next/navigation"
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import routes from "@/app/routes"
import { FilterSelect } from "@/myComponents/FilterSelect";


export default function index() {
    const { loading, setLoading } = useApp()
    const router = useRouter()

    const [roles, setRoles] = useState([])
    const [data, setData] = useState({ fullname: '', email: '', roleId: '', password: '', confirm_password: '' })
    const [errors, setErrors] = useState({ fullname: '', email: '', roleId: '', password: '', confirm_password: '' })
    const [reload, setReload] = useState(false)

    // initialisation
    useEffect(() => {
        // Charge tous les roles
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
    }, [reload])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    // submission
    const submitForm = async (e) => {
        e.preventDefault()

        try {
            await toast.promise(
                axiosInstance.post(apiRoutes.createUser, data),
                {
                    loading: `Création de compte en cours ...`,
                    success: async (res) => {
                        console.log("Response de l'insertion à succès:", res.data)

                        await new Promise((resolve) => setTimeout(resolve, 2000))

                        // redirection
                        router.push(routes.user.list)
                        return 'Utilisateur ajouté.e avec succès!'
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

                        return err?.response?.data?.message || err?.message || "Erreur d'insersion de l'utilisateur"
                    },
                }
            )
        } catch (error) {
            console.log("Erreur catchée :", error)
        }
    }

    // handle role selection
    const handleSelect = (role_id) => {
        console.log("Le role selectionné :", role_id)
        setData((prev) => ({ ...prev, roleId: role_id }))
        setData({ ...data, roleId: role_id })
    }

    // gestion des consoles
    useEffect(() => {
        console.log("Data to submit :", data)
    }, [data])

    useEffect(() => {
        console.log("Les erreures :", errors)
    }, [errors])


    return <>
        <DashboardLayourt title="➕ Ajouter un utilisateurs">
            {/* listes des roles */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <form onSubmit={submitForm} className="shadow-sm border rounded p-2 ">
                            <div className="row">
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="fullname">Nom Complet <span className="text-danger">*</span></Label>
                                    <Input id="fullname"
                                        type="text"
                                        name="fullname"
                                        placeholder="Ex: Christian GOGO"
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
                                        placeholder="gogochristian009@gmail.com"
                                        required
                                        value={data.email}
                                        onChange={handleChange} />
                                    {errors.email && <span className="text-danger">{errors.email}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="password">Mot de passe <span className="text-danger">*</span></Label>
                                    <Input id="password"
                                        name="password"
                                        placeholder="***********"
                                        type="password"
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
                                        placeholder="***********"
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
                            <br />
                            <div className="d-flex justify-content-center bg-light p-3">
                                <Button className="shadow-sm rounded mx-1" variant="outline" onClick={(e) => (e.preventDefault(), router.push(routes.user.list))} > <X /> Retour</Button>
                                <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </DashboardLayourt >
    </>
}