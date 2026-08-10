'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import apiRoutes from "@/api/routes";
import { List, Printer } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { Label } from "@/components/ui/label"

import { DataTable } from "./data-table"


export default function index() {

    const [reload, setReload] = useState(false)

    const [fournisseurs, setFournisseurs] = useState([])
    const [chauffeurs, setChauffeurs] = useState([])
    const [programmations, setProgrammations] = useState([])
    const [selectedFournisseur, setSelectedFournisseur] = useState(null)
    const [selectedChauffeur, setSelectedChauffeur] = useState(null)

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

    // Bons filtrés par période (recalculé automatiquement)
    const filteredProgrammations = useMemo(() => {
        if (!date?.from) return programmations

        const from = startOfDay(date.from)
        const to = date.to ? endOfDay(date.to) : endOfDay(date.from)

        let ps = programmations.filter((p) => {
            const createdAt = new Date(p.createdAt)
            console.log("Programme : ", p)
            if (selectedFournisseur && !selectedChauffeur) {
                console.log("selectedFournisseur && !selectedChauffeur :", selectedFournisseur && !selectedChauffeur)
                return p.commande?.fournisseur?.id == selectedFournisseur && isWithinInterval(createdAt, { start: from, end: to })
            } else if (!selectedFournisseur && selectedChauffeur) {
                console.log("!selectedFournisseur && selectedChauffeur :", !selectedFournisseur && selectedChauffeur)
                return p?.chauffeur?.id == selectedChauffeur && isWithinInterval(createdAt, { start: from, end: to })
            } else if (selectedFournisseur && selectedChauffeur) {
                console.log("selectedFournisseur && selectedChauffeur : ", selectedFournisseur && selectedChauffeur)
                return (p.commande?.fournisseur?.id == selectedFournisseur) && (p?.chauffeur?.id == selectedChauffeur) && isWithinInterval(createdAt, { start: from, end: to })
            } else {
                return isWithinInterval(createdAt, { start: from, end: to })
            }
        })

        console.log("filteredProgrammations")
        return ps;
    }, [programmations, date, selectedFournisseur, selectedChauffeur])

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

    useEffect(() => {
        console.log("programmations :", programmations)
    }, [programmations])

    return <>
        <DashboardLayourt title="Panel du suivi des Chauffeurs" icon={<List />}>
            {/* listes des programmations de commande */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">

                        <DataTable
                            data={filteredProgrammations}
                            setReload={setReload}
                            date={date}
                            setDate={setDate}
                            FournisseurfilterSelect={FournisseurfilterSelect}
                            ChauffeurFilterSelect={ChauffeurFilterSelect}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayourt>
    </>
}