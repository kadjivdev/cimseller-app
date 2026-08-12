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
import { List, Logs, MessageSquarePlus, SquareArrowRightEnter, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"


import { useApp } from "@/app/AppContext"
import { useRouter } from "next/navigation"
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import routes from "@/app/routes"
import { FilterSelect } from "@/myComponents/FilterSelect";
import Link from "next/link";


export default function index() {
    const { loading, setLoading } = useApp()
    const router = useRouter()

    const [representants, setRepresentants] = useState([])
    const [data, setData] = useState({ name: '', description: '' })
    const [errors, setErrors] = useState({ name: '', description: '' })

    // get representants
    const retriveRepresentants = async () => {
        try {
            const response = await axiosInstance.get(apiRoutes.allRepresentant)
            return response.data
        } catch (error) {
            console.log("error lors de la recuperation des representants :", error)
        }
    }

    useEffect(() => {
        // chargement des representants
        toast.promise(
            retriveRepresentants(),
            {
                loading: `Chargment des representants ...`,
                success: function (data) {
                    console.log("Data obtenu après request :", data)
                    setRepresentants(data)
                    return (
                        <>
                            <span className="">Chargement réussi!  </span>
                        </>
                    )
                },
                error: function (err) {
                    return err?.message || "Erreur de chargement des representants"
                },
            }
        )

    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    // handle role selection
    const handleSelect = (representantId) => {
        console.log("Le representant selectionné :", representantId)
        setData((prev) => ({ ...prev, representantId: representantId }))
    }

    // submission
    const submitForm = async (e) => {
        e.preventDefault()

        try {
            await toast.promise(
                axiosInstance.post(apiRoutes.createZone, data),
                {
                    loading: `Création de zone en cours ...`,
                    success: async (res) => {
                        console.log("Response de l'insertion à succès:", res.data)

                        await new Promise((resolve) => setTimeout(resolve, 2000))

                        // redirection
                        router.push(routes.zone.list)
                        return 'Zone ajouté.e avec succès!'
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
        <DashboardLayourt title="Ajouter une zone" icon={<MessageSquarePlus/>}>
            {/* listes des zones */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <div className="flex justify-content-center">
                            <Link className="btn btn-md border shadow-sm rounded p-1 d-flex w-50 justify-content-center align-items-center mb-2" href={routes.zone.list}><List className="mx-1" /> Liste des zones</Link>
                        </div>
                        <form onSubmit={submitForm} className="shadow-sm border rounded p-2 bg-white">
                            <div className="row">
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="fullname">Nom  <span className="text-danger">*</span></Label>
                                    <Input id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Ex: Cotonou"
                                        autoFocus
                                        required
                                        value={data.name}
                                        onChange={handleChange} />
                                    {errors.name && <span className="text-danger">{errors.name}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="description">Description  </Label>
                                    <Textarea
                                        rows={1}
                                        placeholder="Ex :Description"
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={handleChange}
                                    ></Textarea>
                                    {errors.description && <span className="text-danger">{errors.description}</span>}
                                </div>
                                <div className="col-md-12">
                                    <Label htmlFor="representant_id">Choisissez un representant</Label>
                                    <FilterSelect
                                        options={representants?.map((r) => ({ id: r.id, label: `${r.nom} - ${r.prenom}` }))}
                                        handleSelect={handleSelect}
                                        selected={data?.representantId}
                                    />
                                    {errors.representantId && <span className="text-center">{errors.representantId}</span>}
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