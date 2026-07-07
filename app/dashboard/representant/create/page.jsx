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

    const [data, setData] = useState({ nom: '', prenom: '', phone: '', email: '' })
    const [errors, setErrors] = useState({ nom: '', prenom: '', phone: '', email: '' })

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    // submission
    const submitForm = async (e) => {
        e.preventDefault()

        try {
            await toast.promise(
                axiosInstance.post(apiRoutes.createRepresentant, data),
                {
                    loading: `Création de representant en cours ...`,
                    success: async (res) => {
                        console.log("Response de l'insertion à succès:", res.data)

                        await new Promise((resolve) => setTimeout(resolve, 2000))

                        // redirection
                        router.push(routes.representant.list)
                        return 'Representant ajouté avec succès!'
                    },
                    error: (err) => {
                        console.log("Erreur complète :", err.response)

                        if (err?.response?.status === 402) {
                            const validationErrors = err.response.data?.errors
                            const { nom, prenom, phone, email } = validationErrors
                            setErrors({
                                nom: nom?._errors[0],
                                prenom: prenom?._errors[0],
                                phone: phone?._errors[0],
                                email: email?._errors[0],
                            })
                            return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
                        }

                        return err?.response?.data?.error || err?.message || "Erreur de mise à jour de l'utilisateur"
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
        <DashboardLayourt title="➕ Ajouter un representant">
            {/* listes des representants */}
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
                                        placeholder="Ex: CODJIO"
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
                                        placeholder="Jérémie"
                                        required
                                        value={data.prenom}
                                        onChange={handleChange} />
                                    {errors.prenom && <span className="text-danger">{errors.prenom}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input id="phone"
                                        type="text"
                                        name="phone"
                                        placeholder="Ex: +2290156854397"
                                        value={data.phone}
                                        onChange={handleChange} />
                                    {errors.phone && <span className="text-danger">{errors.phone}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="email">Email  </Label>
                                    <Input id="email"
                                        type="text"
                                        name="email"
                                        placeholder="Ex: jeremie@gmaiL.com"
                                        value={data.email}
                                        onChange={handleChange} />
                                    {errors.email && <span className="text-danger">{errors.email}</span>}
                                </div>
                            </div>
                            <br />
                            <div className="d-flex justify-content-center bg-light p-3">
                                <Button className="shadow-sm rounded mx-1" variant="outline" onClick={(e) => (e.preventDefault(), router.push(routes.zone.list))} > <X /> Retour</Button>
                                <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </DashboardLayourt >
    </>
}