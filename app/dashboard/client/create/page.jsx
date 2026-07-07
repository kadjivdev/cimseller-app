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

    const [zones, setZones] = useState([])
    const [status, setStatus] = useState([])

    const [data, setData] = useState({ zoneId: '', statutId: '', raison_sociale: '', profil: '', phone: '', email: '', adresse: '' })
    const [errors, setErrors] = useState({ zoneId: '', statutId: '', raison_sociale: '', profil: '', phone: '', email: '', adresse: '' })

    // initialisation
    useEffect(() => {
        // Charge toutes les zones
        toast.promise(
            () => axiosInstance.get(apiRoutes.allZone),
            {
                loading: 'Chargement des zones de client...',
                success: (res) => {
                    setZones(res.data || [])
                    return 'Zones chargées!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )

        // Charge tous les status de client
        toast.promise(
            () => axiosInstance.get(apiRoutes.allClientStatus),
            {
                loading: 'Chargement des status de client...',
                success: (res) => {
                    setStatus(res.data || [])
                    return 'Status de client chargés!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )
    }, [])


    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: type === "file" ? files?.[0] ?? null : value,
        }));
    };

    // handle statut selection
    const handleStatutSelect = (statutId) => {
        console.log("Le statutId selectionné :", statutId)
        setData((prev) => ({ ...prev, statutId: statutId }))
    }

    // handle zone selection
    const handleZoneSelect = (zoneId) => {
        console.log("Le zoneId selectionné :", zoneId)
        setData((prev) => ({ ...prev, zoneId: zoneId }))
    }

    // submission
    const submitForm = async (e) => {
        e.preventDefault()

        console.log("data state :", data)

        // ✅ construit un vrai FormData pour multer
        const formData = new FormData()
        formData.append('zoneId', data.zoneId)
        formData.append('statutId', data.statutId)
        formData.append('phone', data.phone)
        formData.append('email', data.email)
        formData.append('raison_sociale', data.raison_sociale)
        formData.append('adresse', data.adresse)

        if (data.image instanceof File) {
            formData.append("profil", data.profil);
        }

        console.log("formData :", formData)

        try {
            await toast.promise(
                axiosInstance.post(apiRoutes.createClient, data),
                {
                    loading: `Creation de client en cours...`,
                    success: async (data) => {
                        console.log("Response d'insertion à succès:", data)

                        // redirection
                        router.push(routes.client?.list)
                        router.refresh()
                        return 'Client Crée avec succès!'
                    },
                    error: (err) => {
                        console.log("Erreur complète :", err.response)

                        if (err?.response?.status === 402) {
                            const validationErrors = err.response.data?.errors
                            const { zoneId, statutId, raison_sociale, phone, profil, email } = validationErrors

                            setErrors({
                                zoneId: zoneId?._errors?.[0],
                                statutId: statutId?._errors?.[0],
                                raison_sociale: raison_sociale?._errors?.[0],
                                phone: phone?._errors?.[0],
                                profil: profil?._errors?.[0],
                                email: email?._errors?.[0],
                                adresse: adresse?._errors?.[0],
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
        <DashboardLayourt title="➕ Ajouter un client">
            {/* ajouter des clients */}
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
                                        placeholder="Ex: 2MKA"
                                        autoFocus
                                        required
                                        value={data.raison_sociale}
                                        onChange={handleChange} />
                                    {errors.raison_sociale && <span className="text-danger">{errors.raison_sociale}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="phone">Téléphone </Label>
                                    <Input id="phone"
                                        type="text"
                                        name="phone"
                                        placeholder="Ex: +22956854397"
                                        value={data.phone}
                                        onChange={handleChange} />
                                    {errors.phone && <span className="text-danger">{errors.phone}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="email">Email </Label>
                                    <Input id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Ex: 2mka@gmail.com"
                                        value={data.email}
                                        onChange={handleChange} />
                                    {errors.email && <span className="text-danger">{errors.email}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="adresse">Adresse </Label>
                                    <Input id="adresse"
                                        type="adresse"
                                        name="adresse"
                                        placeholder="Ex: Cotonou"
                                        value={data.adresse}
                                        onChange={handleChange} />
                                    {errors.adresse && <span className="text-danger">{errors.adresse}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="description">Zone  <span className="text-danger">*</span>  </Label>
                                    <FilterSelect
                                        options={zones?.map((zone) => ({ id: zone.id, label: zone.name }))}
                                        handleSelect={handleZoneSelect}
                                        selected={data?.zoneId}
                                    />
                                    {errors.zoneId && <span className="text-danger">{errors.zoneId}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Label htmlFor="description">Statut  <span className="text-danger">*</span>  </Label>
                                    <FilterSelect
                                        options={status?.map((statut) => ({ id: statut.id, label: statut.name }))}
                                        handleSelect={handleStatutSelect}
                                        selected={data?.statutId}
                                    />
                                    {errors.statutId && <span className="text-danger">{errors.statutId}</span>}
                                </div>
                                <div className="col-md-12 mb-2">
                                    <Field>
                                        <FieldLabel htmlFor="profil">Profil</FieldLabel>
                                        <Input
                                            id="profil"
                                            type="file"
                                            name="profil"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </Field>
                                    {errors.profil && <span className="text-danger">{errors.profil}</span>}
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