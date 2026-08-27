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
import { Logs, MessageSquarePlus, SquareArrowRightEnter, X } from "lucide-react";
import Link from "next/link";

export default function index() {
    const { user, loading, setLoading } = useApp()
    const router = useRouter()

    const [detailRecuTypes, setDetailRecuTypes] = useState([])
    const [ventes, setVentes] = useState([])
    const [compteBancaires, setCompteBancaires] = useState([])
    const [selectedClient, setSelectedClient] = useState(null)
    const [selectedVente, setSelectedVente] = useState(null)
    const [showForm, setShowForm] = useState(true)

    const [data, setData] = useState({ typeDetailRecuId: '', venteId: '', deblocDette: false, clientId: '', compteBancaireId: '', reference: '', montant: '', date: '', preuve: '', comment: '' })
    const [errors, setErrors] = useState({ typeDetailRecuId: '', venteId: '', deblocDette: '', clientId: '', compteBancaireId: '', reference: '', montant: '', date: '', preuve: '', comment: '' })

    const isPermittedTo = (name) => {
        return user?.role?.permissions?.some((pr) => pr.name == name)
    }

    // initialisation des données
    useEffect(() => {

        // Charge tous les types de detail recu
        toast.promise(
            () => axiosInstance.get(apiRoutes.allDetailRecuTypes),
            {
                loading: 'Chargement des types de detail reçus  ...',
                success: (res) => {
                    console.log("Les types de details :", res.data)
                    setDetailRecuTypes(res.data || [])
                    return 'Types chargés!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )

        // Charge toutes les ventes validées
        toast.promise(
            () => axiosInstance.get(apiRoutes.allValidatedVente),
            {
                loading: 'Chargement des ventes validées ...',
                success: (res) => {
                    console.log("Les ventes :", res.data)
                    // on filtre just eles ventes non totalement validées
                    setVentes(res.data?.filter((v) => v.reste > 0) || [])
                    return 'Ventes chargées!'
                },
                error: (err) => err?.data?.error || 'Erreur de chargement',
            }
        )

        // Charge tous les compte bancaires
        toast.promise(
            () => axiosInstance.get(apiRoutes.allCompteBancaire),
            {
                loading: 'Chargement des comptes bancaires ...',
                success: (res) => {
                    console.log("Les compte bancaires :", res.data)
                    setCompteBancaires(res.data || [])
                    return 'Compte bancaires chargés!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )
    }, [])

    // handle change
    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;

        if (name == "montant") {
            if (selectedVente?.reste < value) {
                toast.warning(`Le montant saisi ${value} ne doit pas dépasser le montant restant de la vente ${selectedVente?.reste?.toLocaleString({ minimumFractionDigits: 2 })}`)
                return
            }

            if (selectedClient?.solde < value) {
                toast.warning(`Le montant saisi ${value} ne doit pas dépasser le solde du client ${selectedClient?.solde?.toLocaleString({ minimumFractionDigits: 2 })}`)
                return
            }
        }

        setData((prev) => ({
            ...prev,
            [name]: type === "file"
                ? files?.[0] ?? null
                : type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // handle vente selection
    const handleVenteSelect = (venteId) => {
        console.log("La venteId selectionnée :", venteId)

        let vente = ventes.find((v) => v.id == venteId)
        if (!vente) {
            toast.warning("Cette vente est introuvable!")
            return
        }

        console.log("La vente selectionnée :", vente)

        // Chargement du client
        toast.promise(
            () => axiosInstance.get(apiRoutes.retrieveClient(vente.clientId)),
            {
                loading: 'Chargement du client  ...',
                success: (res) => {
                    console.log("Le client :", res.data)
                    if (vente?.montant > res.data?.solde) {
                        toast.warning(`Le montant ${vente?.montant?.toLocaleString({ minimumFractionDigits: 2 })} de la vente dépasse le solde ${res.data?.solde?.toLocaleString({ minimumFractionDigits: 2 })} du client`)

                        setShowForm(false)
                        return
                    }

                    setSelectedClient(res.data || [])
                    setData((prev) => ({ ...prev, clientId: res.data?.id, montant: vente?.reste }))
                    return 'Client chargé!'
                },
                error: (err) => {
                    console.log("Erreure de chargement du client :", err?.response)
                    return err?.message || 'Erreure de chargement de la vente'
                },
            }
        )

        setSelectedVente(vente)
        setData((prev) => ({ ...prev, venteId: venteId }))
    }

    // handle type selection
    const handleTypeDetailRecuSelect = (typeDetailRecuId) => {
        console.log("Le type de détail reçu selectionné :", typeDetailRecuId)
        setData((prev) => ({ ...prev, typeDetailRecuId: typeDetailRecuId }))
    }

    // handle compte bancaire selection
    const handleCompteBancaireSelect = (compteBancaireId) => {
        console.log("Le compteBancaireId selectionné :", compteBancaireId)
        setData((prev) => ({ ...prev, compteBancaireId: compteBancaireId }))
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
                axiosInstance.post(apiRoutes.createReglement, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                }),
                {
                    loading: `Reglement en cours ...`,
                    success: async (res) => {
                        console.log("Response de l'insertion à succès:", res.data)

                        await new Promise((resolve) => setTimeout(resolve, 2000))

                        // redirection
                        router.push(routes.reglement.list)
                        return 'Reglement effectué avec succès!'
                    },
                    error: (err) => {
                        console.log("Erreur complète :", err.response)

                        if (err?.response?.status === 402) {
                            const validationErrors = err.response.data?.errors
                            const { typeDetailRecuId, clientId, venteId, deblocDette, compteBancaireId, reference, montant, date, preuve, comment } = validationErrors
                            setErrors({
                                typeDetailRecuId: typeDetailRecuId?._errors?.[0],
                                venteId: venteId?._errors?.[0],
                                clientId: clientId?._errors?.[0],
                                compteBancaireId: compteBancaireId?._errors?.[0],
                                reference: reference?._errors?.[0],
                                montant: montant?._errors?.[0],
                                date: date?._errors?.[0],
                                preuve: preuve?._errors?.[0],
                                deblocDette: deblocDette._errors?.[0],
                                comment: comment?._errors?.[0]
                            })
                            return err.response.data?.message || 'Erreurs de validation, vérifiez le formulaire.'
                        }

                        return err?.response?.data?.error || err?.message || "Erreur de mise à jour du reglement"
                    },
                }
            )
        } catch (error) {
            console.log("Erreur catchée :", error)
        }
    }

    useEffect(() => {
        console.log("La vente :", selectedVente)
    }, [selectedVente])

    useEffect(() => {
        console.log("Le client :", selectedClient)
    }, [selectedClient])

    // gestion des consoles
    useEffect(() => {
        console.log("Data to submit :", data)
    }, [data])

    useEffect(() => {
        console.log("Les erreures :", errors)
    }, [errors])

    return <>
        <DashboardLayourt title="Ajouter un règlement" icon={<MessageSquarePlus />}>
            {/* ajouter des reglements */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    {isPermittedTo("reglement.create") ?
                        <div className="col-md-10">
                            <div className="flex justify-content-center">
                                <Link className="btn btn-md border shadow-sm rounded p-1 d-flex w-50 justify-content-center align-items-center mb-2" href={routes.reglement.list}><Logs className="mx-1" /> Liste des règlements</Link>
                            </div>
                            {showForm && <form onSubmit={submitForm} className="shadow-sm border rounded p-2 bg-white">
                                <div className="row">
                                    <div className="col-md-12 mb-2">
                                        <Label htmlFor="venteId">Vente <span className="text-danger">*</span>  </Label>
                                        <FilterSelect
                                            options={ventes?.map((v) => ({ id: v.id, label: `${v.code} - Reste : ${v.reste?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || 0.00}` }))}
                                            handleSelect={handleVenteSelect}
                                            selected={data?.venteId}
                                        />
                                        {errors.venteId && <span className="text-danger">{errors.venteId}</span>}
                                    </div>
                                    <div className="col-md-12 mb-2">
                                        <Label htmlFor="reference">Reference  <span className="text-danger">*</span></Label>
                                        <Input id="reference"
                                            type="text"
                                            name="reference"
                                            placeholder="Ex: XXX-XXX-XXX"
                                            autoFocus
                                            required
                                            value={data.reference}
                                            onChange={handleChange} />
                                        {errors.reference && <span className="text-danger">{errors.reference}</span>}
                                    </div>
                                    {selectedClient &&
                                        <div className="col-md-12 mb-2">
                                            <Label htmlFor="clientId">Client <span className="text-danger">*</span>  </Label>
                                            <p className=""><span className="badge bg-light text-dark border shadow-sm"> {`${selectedClient?.raison_sociale} - ${selectedClient?.solde?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || 0.00}`}</span></p>
                                            {errors.clientId && <span className="text-danger">{errors.clientId}</span>}
                                        </div>
                                    }
                                    <div className="col-md-12 mb-2">
                                        <Label htmlFor="montant">Montant <span className="text-danger">*</span></Label>
                                        <Input id="montant"
                                            type="number"
                                            name="montant"
                                            placeholder="Ex: 999.999.999"
                                            required
                                            min={0}
                                            max={selectedVente?.reste}
                                            value={data.montant}
                                            onChange={handleChange} />
                                        {errors.montant && <span className="text-danger">{errors.montant}</span>}
                                    </div>
                                    <div className="col-md-12 mb-2">
                                        <Label htmlFor="montant">Date <span className="text-danger">*</span> </Label>
                                        <Input id="date"
                                            type="date"
                                            name="date"
                                            required
                                            value={data.date}
                                            onChange={handleChange} />
                                        {errors.date && <span className="text-danger">{errors.date}</span>}
                                    </div>

                                    <div className="col-md-12 mb-2">
                                        <Label htmlFor="clientId">Compte bancaire <span className="text-danger">*</span>  </Label>
                                        <FilterSelect
                                            options={compteBancaires?.map((cb) => ({ id: cb.id, label: `${cb.intitule} - ${cb.numero}` }))}
                                            handleSelect={handleCompteBancaireSelect}
                                            selected={data?.compteBancaireId}
                                        />
                                        {errors.compteBancaireId && <span className="text-danger">{errors.compteBancaireId}</span>}
                                    </div>
                                    <div className="col-md-12 mb-2">
                                        <Label htmlFor="typeDetailRecuId">Type de reçu <span className="text-danger">*</span>  </Label>
                                        <FilterSelect
                                            options={detailRecuTypes?.map((dr) => ({ id: dr.id, label: dr.name }))}
                                            handleSelect={handleTypeDetailRecuSelect}
                                            selected={data?.typeDetailRecuId}
                                        />
                                        {errors.typeDetailRecuId && <span className="text-danger">{errors.typeDetailRecuId}</span>}
                                    </div>
                                    <div className="col-md-12 mb-2">
                                        <Field>
                                            <FieldLabel htmlFor="image">Preuve <span className="text-danger">*</span> </FieldLabel>
                                            <Input
                                                id="preuve"
                                                type="file"
                                                name="preuve"
                                                required
                                                onChange={(e) => handleChange(e)}
                                            />
                                        </Field>
                                        {errors.preuve && <span className="text-danger">{errors.preuve}</span>}
                                    </div>
                                    <div className="col-md-12 mb-2">
                                        <Field orientation="horizontal">
                                            <Checkbox
                                                id="deblocDette"
                                                name="deblocDette"
                                                checked={data.deblocDette}
                                                onCheckedChange={(checked) =>
                                                    setData((prev) => ({
                                                        ...prev,
                                                        deblocDette: checked,
                                                    }))
                                                }
                                            />
                                        </Field>
                                        {errors.deblocDette && <span className="text-danger">{errors.deblocDette}</span>}

                                        <FieldContent>
                                            <FieldLabel htmlFor="deblocDette">
                                                Contourner la dette
                                            </FieldLabel>
                                            <FieldDescription>
                                                En cliquant, vous acceptez d'éffectuer le règlement qaund bien même le client a une dette.
                                            </FieldDescription>
                                        </FieldContent>

                                    </div>
                                    <div className="col-md-12 mb-2">
                                        <Label htmlFor="comment">Commentaire  </Label>
                                        <Textarea
                                            rows={1}
                                            placeholder="Ex: Laissez un commentaire ..."
                                            id="comment"
                                            name="comment"
                                            value={data.comment}
                                            onChange={handleChange}
                                        ></Textarea>
                                        {errors.comment && <span className="text-danger">{errors.comment}</span>}
                                    </div>
                                </div>
                                <br />
                                {data &&
                                    <div className="d-flex justify-content-center bg-light p-3">
                                        <Button className="shadow-sm rounded mx-1" variant="outline" onClick={(e) => (e.preventDefault(), router.push(routes.reglement.list))} > <X /> Retour</Button>
                                        <Button type="submit" className="bg-dark text-white shadow-sm rounded"><SquareArrowRightEnter /> Enregistrer</Button>
                                    </div>
                                }
                            </form>}
                        </div> :
                        <p className="text-center text-danger">Vous n'êtes pas autorisé.e à acceder à cette page.</p>
                    }
                </div>
            </div >
        </DashboardLayourt >
    </>
}