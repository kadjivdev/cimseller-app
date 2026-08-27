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

    const [bons, setBons] = useState([])
    const [openAdd, setOpenAdd] = useState(false)
    const [openPrint, setOpenPrint] = useState(false)
    const [selectedBon, setSelectedBon] = useState(null)
    const [programmations, setProgrammations] = useState([])
    const [camions, setCamions] = useState([])
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
        // Charge tous les bons
        toast.promise(
            () => axiosInstance.get(apiRoutes.allValidatedCommande),
            {
                loading: 'Chargement des bons de commande ...',
                success: (res) => {
                    console.log("Les bons :", res.data)
                    // juste les bons validé
                    setBons(res.data || [])
                    return 'Bons chargés!'
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
    }, [reload])

    // Bons filtrés par période (recalculé automatiquement)
    const filteredProgrammations = useMemo(() => {
        if (!date?.from) return programmations

        const from = startOfDay(date.from)
        const to = date.to ? endOfDay(date.to) : endOfDay(date.from)

        return programmations.filter((p) => {
            const createdAt = new Date(p.createdAt)

            if (!isWithinInterval(createdAt, { start: from, end: to })) return false
            if (selectedCamion && p?.camion?.id != selectedCamion) return false

            return true
        })

        return ps;
    }, [programmations, date, selectedCamion])

    // handle command selection
    const handleBonSelect = (bonId) => {
        console.log("La commande selectionné :", bonId)
        let selected = bons.find((bn) => bn.id == bonId)

        // Chargement du bon
        toast.promise(
            () => axiosInstance.get(apiRoutes.retrieveCommande(bonId)),
            {
                loading: 'Chargement du bon de commande ...',
                success: (res) => {
                    console.log("Le bon :", res.data)
                    setSelectedBon(res.data)
                    // seules les programmes imprimée & validée
                    setProgrammations(res.data?.programmations.filter((pr) => pr.imprimer && pr.validatedById) || [])
                    return 'Bon chargé avec succès!'
                },
                error: (err) => err?.response?.message || 'Erreur de chargement',
            }
        )
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

    // handle camion selection
    const handleCamionSelect = (camionId) => {
        console.log("Le camion selectionné :", camionId)
        setSelectedCamion(camionId)
    }

    // printProgrammation
    const printProgrammation = (e) => {
        console.log("Debut d'impression des programmations")
        e.preventDefault()
        setOpenPrint(true)
    }

    useEffect(() => {
        console.log("programmations :", programmations)
    }, [programmations])

    return <>
        <DashboardLayourt title="Panel du suivi des bons" icon={<Van />}>
            {/* listes des programmations de commande */}
            {isPermittedTo("suiviSortie.view") &&
                <div className="container mx-auto py-10">
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-8 mb-2 text-center bg-light border rounded shadow-sm p-2">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="mt-3 border rounded p-1">
                                        <Label htmlFor="bon_id">Choisissez un bon pour afficher ses programmations <span className="text-danger">*</span>  </Label>
                                        <FilterSelect
                                            options={bons?.map((bn) => ({ id: bn.id, label: `${bn.code} | Commandée: ${bn.qteCommander}` }))}
                                            handleSelect={handleBonSelect}
                                            selected={selectedBon?.id}
                                        />
                                        {selectedBon && (
                                            <>
                                                <p className="text-center bg-dark text-white my-3">Bon choisi : {`${selectedBon.code} | Commandée: ${selectedBon.qteCommander} | Programmée:${selectedBon.qteProgrammer} | Stock:${selectedBon.stock}`} </p>
                                                <p className="text-center bg-info text-dark"> {`Fournisseur: ${selectedBon.fournisseur?.sigle}-${selectedBon.fournisseur?.raison_sociale} | Produit: ${selectedBon.commandeDetails?.[0]?.product?.name}`} </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <CamionfilterSelect />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-10">
                            <DataTable
                                data={filteredProgrammations}
                                setReload={setReload}
                                date={date}
                                setDate={setDate}
                                handleBonSelect={handleBonSelect}
                            />
                        </div>
                    </div>
                </div>
            }
        </DashboardLayourt>
    </>
}