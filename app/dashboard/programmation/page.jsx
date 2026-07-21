'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import apiRoutes from "@/api/routes";
import { List } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { Label } from "@/components/ui/label"

import { DataTable } from "./data-table"
import AddProgrammationModal from "./add-modal"


export default function index() {

    const [reload, setReload] = useState(false)

    const [bons, setBons] = useState([])
    const [openAdd, setOpenAdd] = useState(false)
    const [selectedBon, setSelectedBon] = useState(null)
    const [programmations, setProgrammations] = useState([])

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
    }, [reload])

    // Bons filtrés par période (recalculé automatiquement)
    const filteredProgrammations = useMemo(() => {
        if (!date?.from) return programmations

        const from = startOfDay(date.from)
        const to = date.to ? endOfDay(date.to) : endOfDay(date.from)

        let ps = programmations.filter((p) => {
            const createdAt = new Date(p.createdAt)
            return isWithinInterval(createdAt, { start: from, end: to })
        })

        return ps;
    }, [programmations, date])

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
                    setProgrammations(res.data?.programmations || [])
                    return 'Bon chargé avec succès!'
                },
                error: (err) => err?.response?.message || 'Erreur de chargement',
            }
        )
    }

    // addProgrammation
    const addProgrammation = (e) => {
        console.log("selectedBon :", selectedBon)
        if (!selectedBon) return
        e.preventDefault()
        setOpenAdd(true)
    }

    useEffect(() => {
        console.log("bon  :", selectedBon)
        setProgrammations(selectedBon?.programmations || [])
    }, [selectedBon])

    useEffect(() => {
        console.log("programmations :", programmations)
    }, [programmations])

    return <>
        <DashboardLayourt title="Liste des programmations de bons" icon={<List />}>
            {/* listes des programmations de commande */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-8 mb-2 text-center bg-light border rounded shadow-sm p-2">
                        <Label htmlFor="bon_id">Choisissez un bon <span className="text-danger">*</span>  </Label>
                        <FilterSelect
                            options={bons?.map((bn) => ({ id: bn.id, label: `${bn.code} | Commandée: ${bn.qteCommander}` }))}
                            handleSelect={handleBonSelect}
                            selected={selectedBon?.id}
                        />
                        {selectedBon && (
                            <>
                                <p className="text-center bg-dark text-white my-3">Bon choisi : {`${selectedBon.code} | Commandée: ${selectedBon.qteCommander} | Programmée:${selectedBon.qteProgrammer} | Stock:${selectedBon.stock}`} </p>
                                <button
                                    className="btn btn-sm bg-dark text-white"
                                    disabled={selectedBon?.stock == 0}
                                    onClick={addProgrammation}
                                >➕ Programmer ce bon</button>
                            </>
                        )}
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
        </DashboardLayourt>

        {/* ajout de programmtion */}
        <AddProgrammationModal
            open={openAdd}
            onOpenChange={setOpenAdd}
            bon={selectedBon}
            handleBonSelect={handleBonSelect}
        />
    </>
}