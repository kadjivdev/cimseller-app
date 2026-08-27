'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import apiRoutes from "@/api/routes";
import { List, Printer, Van } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { Label } from "@/components/ui/label"

import { DataTable } from "./data-table"
import { useApp } from "@/app/AppContext"

export default function index() {
    const { user } = useApp()
    const [reload, setReload] = useState(0)

    const [fournisseurs, setFournisseurs] = useState([])
    const [chauffeurs, setChauffeurs] = useState([])
    const [camions, setCamions] = useState([])
    const [programmations, setProgrammations] = useState([])
    const [selectedFournisseur, setSelectedFournisseur] = useState(null)
    const [selectedChauffeur, setSelectedChauffeur] = useState(null)
    const [selectedCamion, setSelectedCamion] = useState(null)

    const isPermittedTo = (name) => {
        return user?.role?.permissions?.some((pr) => pr.name == name)
    }

    // filtres de données par poériode
    const [date, setDate] = useState({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    })

    //Initialization des données
    useEffect(() => {
        // Charge tous les fournisseurs
        toast.promise(
            () => axiosInstance.get(apiRoutes.allFournisseur),
            {
                loading: 'Chargement de tous les fournisseurs ...',
                success: (res) => {
                    console.log("Les fournisseurs :", res.data)
                    // juste les bons validé
                    setFournisseurs(res.data || [])
                    return 'Fournisseurs chargées!'
                },
                error: (err) => err?.response?.message || 'Erreur de chargement',
            }
        )

        // Charge tous les chauffeurs
        toast.promise(
            () => axiosInstance.get(apiRoutes.allChauffeur),
            {
                loading: 'Chargement de tous les chauffeurs ...',
                success: (res) => {
                    console.log("Les chauffeurs :", res.data)
                    setChauffeurs(res.data || [])
                    return 'Chauffeurs chargées!'
                },
                error: (err) => err?.response?.message || 'Erreur de chargement',
            }
        )

        // Charge tous les camions
        toast.promise(
            () => axiosInstance.get(apiRoutes.allCamion),
            {
                loading: 'Chargement de tous les camions ...',
                success: (res) => {
                    console.log("Les camions :", res.data)
                    setCamions(res.data || [])
                    return 'Camions chargés!'
                },
                error: (err) => err?.response?.message || 'Erreur de chargement',
            }
        )

        // Charge toutes les programmations
        toast.promise(
            () => axiosInstance.get(apiRoutes.allValidatedProgrammation),
            {
                loading: 'Chargement de toutes les programmations bons de commande ...',
                success: (res) => {
                    console.log("Les programmations :", res.data)
                    // juste les bons validé && imprimer && bb && dateSortie
                    setProgrammations(res.data?.filter((pr) => (pr.imprimer && pr.validatedById && pr.dateSortie && pr.bl)) || [])
                    return 'Programmations chargées!'
                },
                error: (err) => err?.response?.message || 'Erreur de chargement des programmations',
            }
        )
    }, [reload])

    // Programmations filtrées par période (recalculé automatiquement)
    const filteredProgrammations = useMemo(() => {
        if (!date?.from) return programmations

        const from = startOfDay(date.from)
        const to = date.to ? endOfDay(date.to) : endOfDay(date.from)

        return programmations.filter((p) => {
            const createdAt = new Date(p.createdAt)

            if (!isWithinInterval(createdAt, { start: from, end: to })) return false
            if (selectedFournisseur && p.commande?.fournisseur?.id != selectedFournisseur) return false
            if (selectedChauffeur && p?.chauffeur?.id != selectedChauffeur) return false
            if (selectedCamion && p?.camion?.id != selectedCamion) return false

            return true
        })
    }, [programmations, date, selectedFournisseur, selectedChauffeur, selectedCamion])

    // filter select
    const FournisseurfilterSelect = () => {
        return <>
            <Label htmlFor="">Choisissez un fournisseur <span className="text-danger">*</span>  </Label>
            <FilterSelect
                options={fournisseurs?.map((fr) => ({ id: fr.id, label: `${fr.sigle}-${fr.raison_sociale}` }))}
                handleSelect={handleFournisseurSelect}
                selected={selectedFournisseur}
            />
        </>
    }

    // filter select
    const CamionfilterSelect = () => {
        return <>
            <Label htmlFor="">Choisissez un Camion <span className="text-danger">*</span>  </Label>
            <FilterSelect
                options={camions?.map((cm) => ({ id: cm.id, label: `${cm.immatriculation}` }))}
                handleSelect={handleCamionSelect}
                selected={selectedCamion}
            />
        </>
    }

    // filter select
    const ChauffeurFilterSelect = () => {
        return <>
            <Label htmlFor="">Choisissez un Chauffeur <span className="text-danger">*</span>  </Label>
            <FilterSelect
                options={chauffeurs?.map((cf) => ({ id: cf.id, label: `${cf.fullname}` }))}
                handleSelect={handleChauffeurSelect}
                selected={selectedChauffeur}
            />
        </>
    }

    // handle fournisseur selection
    const handleFournisseurSelect = (fournisseurId) => {
        console.log("Le fourisseur selectionné :", fournisseurId)
        setSelectedFournisseur(fournisseurId)
    }

    // handle chauffeur selection
    const handleChauffeurSelect = (chauffeurId) => {
        console.log("Le chauffeur selectionné :", chauffeurId)
        setSelectedChauffeur(chauffeurId)
    }

    // handle camion selection
    const handleCamionSelect = (camionId) => {
        console.log("Le camion selectionné :", camionId)
        setSelectedCamion(camionId)
    }

    useEffect(() => {
        console.log("programmations :", programmations)
    }, [programmations])

    return <>
        <DashboardLayourt title="Panel du suivi des Chauffeurs" icon={<Van />}>
            {/* listes des suivi chauffeur de commande */}
            <div className="container mx-auto py-10">
                {isPermittedTo("suiviChauffeur.view") ?
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-10">
                            <DataTable
                                data={filteredProgrammations}
                                date={date}
                                setDate={setDate}
                                FournisseurfilterSelect={FournisseurfilterSelect}
                                ChauffeurFilterSelect={ChauffeurFilterSelect}
                                CamionfilterSelect={CamionfilterSelect}
                            />
                        </div>
                    </div> :
                    <p className="text-center text-danger">Vous n'êtes pas autorisé.e à acceder à cette page.</p>
                }
            </div>
        </DashboardLayourt>
    </>
}