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

    const [banques, setBanques] = useState([])

    const [data, setData] = useState({ banqueId: '', intitule: '', numero: '' })
    const [errors, setErrors] = useState({ banqueId: '', intitule: '', numero: '' })

    // get banques
    const retriveBanques = async () => {
        try {
            const response = await axiosInstance.get(apiRoutes.allBanque)
            return response.data
        } catch (error) {
            console.log("error lors de la recuperation des banques :", error)
        }
    }

    useEffect(() => {
        // chargement des comptes bancaires
        toast.promise(
            retriveBanques(),
            {
                loading: `Chargment des banques ...`,
                success: function (data) {
                    console.log("Data obtenu après request :", data)
                    setBanques(data)
                    return (
                        <>
                            <span className="">Chargement des banques réussi!  </span>
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
    const handleSelect = (banqueId) => {
        console.log("La banque selectionné :", banqueId)
        setData((prev) => ({ ...prev, banqueId: banqueId }))
    }

    // submission
    const submitForm = async (e) => {
        e.preventDefault()

        try {
            await toast.promise(
                axiosInstance.post(apiRoutes.createCompteBancaire, data),
                {
                    loading: `Création de compte bancaire en cours ...`,
                    success: async (res) => {
                        console.log("Response de l'insertion à succès:", res.data)

                        await new Promise((resolve) => setTimeout(resolve, 2000))

                        // redirection
                        router.push(routes.compteBancaire.list)
                        return 'Compte bancaire ajouté avec succès!'
                    },
                    error: (err) => {
                        console.log("Erreur complète :", err.response)

                        if (err?.response?.status === 402) {
                            const validationErrors = err.response.data?.errors
                            const { banqueId, intitule, numero } = validationErrors
                            setErrors({
                                banqueId: banqueId?._errors[0],
                                intitule: intitule?._errors[0],
                                numero: numero?._errors[0],
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
        <DashboardLayourt title="➕ Ajouter un compte bancaire">
            {/* listes des zones */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <form onSubmit={submitForm} className="shadow-sm border rounded p-2 ">
                            <div className="row">
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="intitule">Intitulé  <span className="text-danger">*</span></Label>
                                    <Input id="intitule"
                                        type="text"
                                        name="intitule"
                                        placeholder="Ex: KADJIV Sarl"
                                        autoFocus
                                        required
                                        value={data.intitule}
                                        onChange={handleChange} />
                                    {errors.name && <span className="text-danger">{errors.intitule}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="numero">Numéro  <span className="text-danger">*</span></Label>
                                    <Input id="numero"
                                        type="text"
                                        name="numero"
                                        placeholder="Ex: 02 83 72 60 009"
                                        required
                                        value={data.numero}
                                        onChange={handleChange} />
                                    {errors.name && <span className="text-danger">{errors.numero}</span>}
                                </div>
                                <div className="col-md-12">
                                    <Label htmlFor="representant_id">Choisissez une banque</Label>
                                    <FilterSelect
                                        options={banques?.map((b) => ({ id: b.id, label: `${b.name}` }))}
                                        handleSelect={handleSelect}
                                        selected={data?.banqueId}
                                    />
                                    {errors.banqueId && <span className="text-center">{errors.banqueId}</span>}
                                </div>
                            </div>
                            <br />
                            <div className="d-flex justify-content-center bg-light p-3">
                                <Button className="shadow-sm rounded mx-1" variant="outline" onClick={(e) => (e.preventDefault(), router.push(routes.compteBancaire.list))} > <X /> Retour</Button>
                                <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </DashboardLayourt >
    </>
}