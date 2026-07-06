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

    const [data, setData] = useState({ marqueId: '', immatriculation: '', libelle: '' })
    const [errors, setErrors] = useState({ marqueId: '', immatriculation: '', libelle: '' })
    const [marques, setMarques] = useState([])

    // get marques
    const retriveMarques = async () => {
        try {
            const response = await axiosInstance.get(apiRoutes.allMarqueCamion)
            console.log("Response de recuperation des marques :", response.data)
            return response.data
        } catch (error) {
            console.log("error lors de la recuperation des marques :", error)
        }
    }

    // get marques
    useEffect(() => {
        try {
            toast.promise(
                retriveMarques(),
                {
                    loading: `Chargement des marques de camions...`,
                    success: (data) => {
                        console.log("Response de recuperation des marque camions:", data)
                        setMarques(data || [])
                        return 'Marques de camions chargées avec succès!'
                    },
                    error: (err) => "Erreure lors du chargement des marques de camions",
                }
            )
        } catch (error) {
            console.log("Erreur catchée :", error)
        }
    }, [])

    // handle input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    // handle role selection
    const handleSelect = (marqueId) => {
        console.log("La marque selectionnée :", marqueId)
        setData((prev) => ({ ...prev, marqueId }))
    }

    // submission
    const submitForm = async (e) => {
        e.preventDefault()

        try {
            await toast.promise(
                axiosInstance.post(apiRoutes.createCamion, data),
                {
                    loading: `Création du camion en cours ...`,
                    success: async (res) => {
                        console.log("Response de l'insertion à succès:", res.data)

                        await new Promise((resolve) => setTimeout(resolve, 2000))

                        // redirection
                        router.push(routes.camion.list)
                        router.refresh()
                        return 'Camion ajouté.e avec succès!'
                    },
                    error: (err) => {
                        console.log("Erreur complète :", err.response)

                        if (err?.response?.status === 402) {
                            const validationErrors = err.response.data?.errors
                            const { marqueId, immatriculation, libelle } = validationErrors
                            setErrors({
                                marqueId: marqueId?._errors[0],
                                immatriculation: immatriculation?._errors[0],
                                libelle: libelle?._errors[0],
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
        console.log("Marques :", marques)
    }, [marques])

    useEffect(() => {
        console.log("Les erreures :", errors)
    }, [errors])


    return <>
        <DashboardLayourt title="➕ Ajouter un camion" icon={<Logs className="w-5 h-5" />}>
            {/* listes des camions */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <form onSubmit={submitForm} className="shadow-sm border rounded p-2 ">
                            <div className="row">
                                <div className="col-md-12">
                                    <Label htmlFor="marqueId">Choisissez une marque</Label>
                                    <FilterSelect
                                        options={marques?.map((marque) => ({ id: marque.id, label: marque.name }))}
                                        handleSelect={handleSelect}
                                        selected={data?.marqueId}
                                    />
                                    {errors.marqueId && <span className="text-center">{errors.marqueId}</span>}
                                </div>
                                <Separator className="my-2" />
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="immatriculation">Immatriculation  <span className="text-danger">*</span></Label>
                                    <Input id="immatriculation"
                                        type="text"
                                        name="immatriculation"
                                        placeholder="Ex: 1AB-123-CD"
                                        required
                                        value={data.immatriculation}
                                        onChange={handleChange} />
                                    {errors.immatriculation && <span className="text-danger">{errors.immatriculation}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="libelle">Libellé <span className="text-danger">*</span>  </Label>
                                    <Input id="libelle"
                                        type="text"
                                        name="libelle"
                                        placeholder="Ex: Camion Poids lourd"
                                        required
                                        value={data.libelle}
                                        value={data.libelle}
                                        onChange={handleChange} />
                                    {errors.libelle && <span className="text-danger">{errors.libelle}</span>}
                                </div>
                            </div>
                            <br />
                            <div className="d-flex justify-content-center bg-light p-3">
                                <Button className="shadow-sm rounded mx-1" variant="outline" onClick={(e) => (e.preventDefault(), router.push(routes.camion.list))} > <X /> Retour</Button>
                                <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </DashboardLayourt >
    </>
}