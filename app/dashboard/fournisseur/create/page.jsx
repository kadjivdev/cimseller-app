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

    const [data, setData] = useState({ raison_sociale: '', phone: '', email: '', adresse: '' })
    const [errors, setErrors] = useState({ raison_sociale: '', phone: '', email: '', adresse: '' })

    // handle input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    // submission
    const submitForm = async (e) => {
        e.preventDefault()

        try {
            await toast.promise(
                axiosInstance.post(apiRoutes.createFournisseur, data),
                {
                    loading: `Création du fournisseur en cours ...`,
                    success: async (data) => {
                        console.log("Response d'insertion à succès:", data)

                        // redirection
                        router.push(routes.fournisseur?.list)
                        router.refresh()
                        return 'Fournisseur cré.e avec succès!'
                    },
                    error: (err) => {
                        console.log("Erreur complète :", err.response)

                        if (err?.response?.status === 402) {
                            const validationErrors = err.response.data?.errors
                            const { raison_sociale, phone, email, adresse } = validationErrors
                            setErrors({
                                raison_sociale: raison_sociale?._errors[0],
                                phone: phone?._errors[0],
                                email: email?._errors[0],
                                adresse: adresse?._errors[0],
                            })
                            return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
                        }

                        return err?.response?.data?.error || err?.message || "Erreur de mise à jour du fournisseur"
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
        <DashboardLayourt title="➕ Ajouter un fournisseur" icon={<Logs className="w-5 h-5" />}>

            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <form onSubmit={submitForm} className="shadow-sm border rounded p-2 ">
                            <div className="row">
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="raison_sociale">Raison sociale  <span className="text-danger">*</span></Label>
                                    <Input id="raison_sociale"
                                        type="text"
                                        name="raison_sociale"
                                        placeholder="Ex: NOCIBE"
                                        required
                                        value={data.raison_sociale}
                                        onChange={handleChange} />
                                    {errors.raison_sociale && <span className="text-danger">{errors.raison_sociale}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="phone">Téléphone  </Label>
                                    <Input id="phone"
                                        type="text"
                                        name="phone"
                                        placeholder="Ex: +2290156854397"
                                        value={data.phone}
                                        onChange={handleChange} />
                                    {errors.phone && <span className="text-danger">{errors.phone}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="adresse">Adresse  </Label>
                                    <Input id="adresse"
                                        type="text"
                                        name="adresse"
                                        placeholder="Ex: COTONOU"
                                        value={data.adresse}
                                        onChange={handleChange} />
                                    {errors.adresse && <span className="text-danger">{errors.adresse}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="phone">Email  </Label>
                                    <Input id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Ex: gogochristian009@gmail.com"
                                        value={data.email}
                                        onChange={handleChange} />
                                    {errors.email && <span className="text-danger">{errors.email}</span>}
                                </div>
                            </div>
                            <br />
                            <div className="d-flex justify-content-center bg-light p-3">
                                <Button className="shadow-sm rounded mx-1" variant="outline" onClick={(e) => (e.preventDefault(), router.push(routes.fournisseur.list))} > <X /> Retour</Button>
                                <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </DashboardLayourt >
    </>
}