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

    const [data, setData] = useState({ nom: '', prenom: '', phone: '' })
    const [errors, setErrors] = useState({ nom: '', prenom: '', phone: '' })

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    // submission
    const submitForm = async (e) => {
        e.preventDefault()

        try {
            await toast.promise(
                axiosInstance.post(apiRoutes.createAgent, data),
                {
                    loading: `Création de l'agent en cours ...`,
                    success: async (res) => {
                        console.log("Response de l'insertion à succès:", res.data)

                        await new Promise((resolve) => setTimeout(resolve, 2000))

                        // redirection
                        router.push(routes.agent.list)
                        return 'Agent ajouté avec succès!'
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

    // gestion des consoles
    useEffect(() => {
        console.log("Data to submit :", data)
    }, [data])

    useEffect(() => {
        console.log("Les erreures :", errors)
    }, [errors])


    return <>
        <DashboardLayourt title="➕ Ajouter un agent">
            {/* listes des agents */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <form onSubmit={submitForm} className="shadow-sm border rounded p-2 ">
                            <div className="row">
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="fullname">Nom  <span className="text-danger">*</span></Label>
                                    <Input id="nom"
                                        type="text"
                                        name="nom"
                                        placeholder="Ex: John"
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
                                        placeholder="Ex: Doe"
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
                                        placeholder="Ex: +243 99 999 9999"
                                        required
                                        value={data.phone}
                                        onChange={handleChange} />
                                    {errors.phone && <span className="text-danger">{errors.phone}</span>}
                                </div>
                            </div>
                            <br />
                            <div className="d-flex justify-content-center bg-light p-3">
                                <Button className="shadow-sm rounded mx-1" variant="outline" onClick={(e) => (e.preventDefault(), router.push(routes.agent.list))} > <X /> Retour</Button>
                                <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </DashboardLayourt >
    </>
}