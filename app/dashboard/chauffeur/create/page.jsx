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

    const [data, setData] = useState({ fullname: '', permis: '', phone: '' })
    const [errors, setErrors] = useState({ fullname: '', permis: '', phone: '' })

    const handleChange = (e) => {
        const { name, value, type, files } = e.target
        setData((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value
        }))
    }

    // submission
    const submitForm = async (e) => {
        e.preventDefault()

        // ✅ construit un vrai FormData pour multer
        const formData = new FormData()
        formData.append('fullname', data.fullname)
        formData.append('phone', data.phone)

        if (data.permis instanceof File) {
            formData.append('permis', data.permis)
        }

        try {
            await toast.promise(
                axiosInstance.post(apiRoutes.createChauffeur, formData),
                {
                    loading: `Création du chauffeur en cours ...`,
                    success: async (res) => {
                        console.log("Response de l'insertion à succès:", res.data)

                        await new Promise((resolve) => setTimeout(resolve, 2000))

                        // redirection
                        router.push(routes.chauffeur.list)
                        return 'Chauffeur ajouté avec succès!'
                    },
                    error: (err) => {
                        console.log("Erreur complète :", err.response)

                        if (err?.response?.status === 402) {
                            const validationErrors = err.response.data?.errors
                            const { fullname, phone, permis } = validationErrors
                            setErrors({
                                fullname: fullname?._errors[0],
                                phone: phone?._errors[0],
                                permis: permis?._errors[0],
                            })
                            return err.response.data?.message || err.response.data?.error || 'Erreurs de validation, vérifiez le formulaire.'
                        }

                        return err?.response?.data?.message || err?.response?.data?.error || "Erreur de mise à jour de l'utilisateur"
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


    return <>
        <DashboardLayourt title="➕ Ajouter un chauffeur">
            {/* listes des agents */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <form onSubmit={submitForm} className="shadow-sm border rounded p-2 ">
                            <div className="row">
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="fullname">Nom Complet  <span className="text-danger">*</span></Label>
                                    <Input id="fullname"
                                        type="text"
                                        name="fullname"
                                        placeholder="Ex: Edouard Mbuyi"
                                        autoFocus
                                        required
                                        value={data.fullname}
                                        onChange={handleChange} />
                                    {errors.fullname && <span className="text-danger">{errors.fullname}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="phone">Télephone  <span className="text-danger">*</span></Label>
                                    <Input id="phone"
                                        type="text"
                                        name="phone"
                                        placeholder="Ex: +243 000 000 000"
                                        required
                                        value={data.phone}
                                        onChange={handleChange} />
                                    {errors.phone && <span className="text-danger">{errors.phone}</span>}
                                </div>
                            </div>
                            <div className="col-md-12 mb-2">
                                <Field>
                                    <FieldLabel htmlFor="permis">Permis</FieldLabel>
                                    <Input
                                        id="permis"
                                        type="file"
                                        name="permis"
                                        onChange={(e) => handleChange(e)}
                                    />
                                </Field>
                                {errors.permis && <span className="text-danger">{errors.permis}</span>}
                            </div>

                            <br />
                            <div className="d-flex justify-content-center bg-light p-3">
                                <Button className="shadow-sm rounded mx-1" variant="outline" onClick={(e) => (e.preventDefault(), router.push(routes.chauffeur.list))} > <X /> Retour</Button>
                                <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </DashboardLayourt >
    </>
}