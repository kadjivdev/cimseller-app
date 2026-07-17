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
import { Checkbox } from "@/components/ui/checkbox"

import { useApp } from "@/app/AppContext"
import { useRouter } from "next/navigation"
import axiosInstance from "@/api/axios";
import apiRoutes from "@/api/routes";
import routes from "@/app/routes"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { SquareArrowRightEnter, X } from "lucide-react";


export default function index() {
    const router = useRouter()

    const [types, setTypes] = useState([])
    const [fournisseurs, setFournisseurs] = useState([])
    const [data, setData] = useState({ reference: "", typeId: '', fournisseurId: '', montant: '', date: '' })
    const [errors, setErrors] = useState({ reference: "", typeId: '', fournisseurId: '', montant: '', date: '' })

    // initialisation des erreurs
    useEffect(() => {

        // Charge tous les types de bon
        toast.promise(
            () => axiosInstance.get(apiRoutes.allCommandeTypes),
            {
                loading: 'Chargement des types de bons de commande ...',
                success: (res) => {
                    console.log("Les types :", res.data)
                    setTypes(res.data || [])
                    return 'Types chargés!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )

        // Charge tous les fournisseurs de bon
        toast.promise(
            () => axiosInstance.get(apiRoutes.allFournisseur),
            {
                loading: 'Chargement des fournisseurs ...',
                success: (res) => {
                    console.log("Les fournisseurs :", res.data)
                    setFournisseurs(res.data || [])
                    return 'Fournisseurs chargés!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )
    }, [])

    // handle change
    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: type === "file"
                ? files?.[0] ?? null
                : type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // handle type selection
    const handleTypeSelect = (typeId) => {
        console.log("Le type selectionné :", typeId)
        setData((prev) => ({ ...prev, typeId: typeId }))
    }

    // handle fournisseur selection
    const handleFournisseurSelect = (fournisseurId) => {
        console.log("Le fournisseurId selectionné :",)
        setData((prev) => ({ ...prev, fournisseurId: fournisseurId }))
    }

    // submission
    const submitForm = async (e) => {
        e.preventDefault()

        console.log("data state :", data)

        // ✅ construit un vrai FormData pour multer
        const formData = new FormData()
        formData.append('name', data.name)

        if (data.image instanceof File) {
            formData.append("image", data.image);
        }

        try {
            await toast.promise(
                axiosInstance.post(apiRoutes.createCommande, data),
                {
                    loading: `Bon de commande en cours ...`,
                    success: async (res) => {
                        console.log("Response de l'insertion à succès:", res.data)

                        await new Promise((resolve) => setTimeout(resolve, 2000))

                        // redirection
                        router.push(routes.bonCommande.list)
                        router.refresh()
                        return 'Bon de commande effectué avec succès!'
                    },
                    error: (err) => {
                        console.log("Erreur complète :", err.response)

                        if (err?.response?.status === 402) {
                            const validationErrors = err.response.data?.errors
                            const { typeId, fournisseurId, date, reference } = validationErrors
                            setErrors({
                                reference: reference?._errors?.[0],
                                typeId: typeId?._errors?.[0],
                                fournisseurId: fournisseurId?._errors?.[0],
                                date: date?._errors?.[0],
                            })
                            return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
                        }

                        return err?.response?.data?.error || err?.message || "Erreur de mise à jour de l'approvisionnmeent"
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
        <DashboardLayourt title="➕ Ajouter un bon de commande">
            {/* ajouter des bons */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <form onSubmit={submitForm} className="shadow-sm border rounded p-2 ">
                            <div className="row">
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="reference">Reference <span className="text-danger">*</span> </Label>
                                    <Input id="date"
                                        type="text"
                                        name="reference"
                                        placeholder="Ex: GFTR56SR89"
                                        required
                                        value={data.reference}
                                        onChange={handleChange} />
                                    {errors.reference && <span className="text-danger">{errors.reference}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="date">Date <span className="text-danger">*</span> </Label>
                                    <Input id="date"
                                        type="date"
                                        name="date"
                                        required
                                        value={data.date}
                                        onChange={handleChange} />
                                    {errors.date && <span className="text-danger">{errors.date}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="fournisseurId">Fournisseur <span className="text-danger">*</span>  </Label>
                                    <FilterSelect
                                        options={fournisseurs?.map((fr) => ({ id: fr.id, label: fr.raison_sociale }))}
                                        handleSelect={handleFournisseurSelect}
                                        selected={data?.fournisseurId}
                                    />
                                    {errors.fournisseurId && <span className="text-danger">{errors.fournisseurId}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="typeId">Type de Commande <span className="text-danger">*</span>  </Label>
                                    <FilterSelect
                                        options={types?.map((tp) => ({ id: tp.id, label: tp.name }))}
                                        handleSelect={handleTypeSelect}
                                        selected={data?.typeId}
                                    />
                                    {errors.typeId && <span className="text-danger">{errors.typeId}</span>}
                                </div>
                            </div>
                            <br />
                            <div className="d-flex justify-content-center bg-light p-3">
                                <Button className="shadow-sm rounded mx-1" variant="outline" onClick={(e) => (e.preventDefault(), router.push(routes.approvisionnement.list))} > <X /> Retour</Button>
                                <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </DashboardLayourt >
    </>
}