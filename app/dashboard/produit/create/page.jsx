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
import axios from "axios";
import apiRoutes from "@/api/routes";
import routes from "@/app/routes"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { SquareArrowRightEnter, X } from "lucide-react";


export default function index() {
    const { loading, setLoading } = useApp()
    const router = useRouter()

    const [types, setTypes] = useState([])
    const [data, setData] = useState({ name: '', description: '', fournisseurPrice: '', typeId: '', image: '' })
    const [errors, setErrors] = useState({ name: '', description: '', fournisseurPrice: '', typeId: '', image: '' })

    // Charge tous les type de produit
    useEffect(() => {
        if (!open) return
        toast.promise(
            () => axiosInstance.get(apiRoutes.allTypeProduit),
            {
                loading: 'Chargement des types de produit...',
                success: (res) => {
                    setTypes(res.data || [])
                    return 'Types de produit chargés!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )
    }, [])

    // handle change
    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: type === "file" ? files?.[0] ?? null : value,
        }));
    };

    // handle type selection
    const handleSelect = (type_id) => {
        console.log("Le type selectionné :", type_id)
        setData((prev) => ({ ...prev, typeId: type_id }))
    }

    // submission
    const submitForm = async (e) => {
        e.preventDefault()

        console.log("data state :", data)

        // ✅ construit un vrai FormData pour multer
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('description', data.description)
        formData.append('fournisseurPrice', data.fournisseurPrice)
        formData.append('typeId', data.typeId)

        if (data.image instanceof File) {
            formData.append("image", data.image);
        }

        try {
            await toast.promise(
                axiosInstance.post(apiRoutes.createProduit, formData),
                {
                    loading: `Création du produit en cours ...`,
                    success: async (res) => {
                        console.log("Response de l'insertion à succès:", res.data)

                        await new Promise((resolve) => setTimeout(resolve, 2000))

                        // redirection
                        router.push(routes.produit.list)
                        return 'Produit ajouté avec succès!'
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
        <DashboardLayourt title="➕ Ajouter un produit">
            {/* ajouter des roles */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <form onSubmit={submitForm} className="shadow-sm border rounded p-2 ">
                            <div className="row">
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="fullname">Nom  <span className="text-danger">*</span></Label>
                                    <Input id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Ex: Ciment"
                                        autoFocus
                                        required
                                        value={data.name}
                                        onChange={handleChange} />
                                    {errors.name && <span className="text-danger">{errors.name}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="fournisseurPrice">Prix du forunisseur </Label>
                                    <Input
                                        id="fournisseurPrice"
                                        type="number"
                                        placeholder="Ex : 75000"
                                        name="fournisseurPrice"
                                        value={data.fournisseurPrice}
                                        onChange={handleChange} />
                                    {errors.fournisseurPrice && <span className="text-danger">{errors.fournisseurPrice}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="type_id">Type de produit <span className="text-danger">*</span>  </Label>
                                    <FilterSelect
                                        options={types?.map((type) => ({ id: type.id, label: type.name }))}
                                        handleSelect={handleSelect}
                                        selected={data?.typeId}
                                    />
                                    {errors.typeId && <span className="text-danger">{errors.typeId}</span>}
                                    
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Field>
                                        <FieldLabel htmlFor="image">Image produit</FieldLabel>
                                        <Input
                                            id="image"
                                            type="file"
                                            name="image"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </Field>
                                    {errors.image && <span className="text-danger">{errors.image}</span>}
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
                            </div>
                            <br />
                            <div className="d-flex justify-content-center bg-light p-3">
                                <Button className="shadow-sm rounded mx-1" variant="outline" onClick={(e) => (e.preventDefault(), router.push(routes.produit.list))} > <X /> Retour</Button>
                                <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </DashboardLayourt >
    </>
}