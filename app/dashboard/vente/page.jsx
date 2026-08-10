'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import apiRoutes from "@/api/routes";
import { List, Printer, ShoppingCart } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { Label } from "@/components/ui/label"

import { DataTable } from "./data-table"
import AddVenteModal from "./add-modal"

export default function index() {

    const [reload, setReload] = useState(false)
    const [open, setOpen] = useState(false)
    const [openAdd, setOpenAdd] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const [programmations, setProgrammations] = useState([])
    const [ventes, setVentes] = useState([])
    const [selectedVente, setSelectedVente] = useState(null)
    const [selectedProgrammation, setSelectedProgrammation] = useState(null)

    // filtres de données par poériode
    const [date, setDate] = useState({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    })

    //Initialization des données
    useEffect(() => {
        // Charge des ventes
        toast.promise(
            () => axiosInstance.get(apiRoutes.allValidatedProgrammation),
            {
                loading: 'Chargement des ventes ...',
                success: (res) => {
                    console.log("Les programmations :", res.data)
                    // les programmes dejà livrée etc..
                    setProgrammations(res.data?.filter((pr) => (pr.imprimer && pr.bl && pr.dateSortie && (pr.qteLivre == pr.qteProgrammer))) || [])
                    return 'Programmations chargées!'
                },
                error: (err) => err?.response?.message || 'Erreur de chargement des ventes',
            }
        )
    }, [reload])

    // Vnetes filtrés par période (recalculé automatiquement)
    const filteredVentes = useMemo(() => {
        if (!date?.from) return ventes

        const from = startOfDay(date.from)
        const to = date.to ? endOfDay(date.to) : endOfDay(date.from)

        let vs = ventes.filter((v) => {
            const createdAt = new Date(v.createdAt)
            return isWithinInterval(createdAt, { start: from, end: to })
        })

        return vs;
    }, [ventes, date])

    // handle programmation selection
    const handleProgrammationSelect = (programmationId) => {
        console.log("La programmation selectionné :", programmationId)

        // Chargement de la programmation
        toast.promise(
            () => axiosInstance.get(apiRoutes.retrieveProgrammation(programmationId)),
            {
                loading: 'Chargement de la programmation ...',
                success: (res) => {
                    console.log("La programmation :", res.data)
                    setSelectedProgrammation(res.data)
                    setVentes(res.data?.ventes || [])
                    return 'Programmation chargée avec succès!'
                },
                error: (err) => {
                    console.log(err?.response)

                    return err?.response?.data?.error || 'Erreur de chargement de la programmation'
                },
            }
        )
    }

    // addVente
    const addVente = (e) => {
        console.log("selectedProgrammation :", selectedProgrammation)
        if (!selectedProgrammation) return
        e.preventDefault()
        setOpenAdd(true)
    }

    return <>
        <DashboardLayourt title="Liste des ventes" icon={<List />}>
            {/* listes des ventes de commande */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-8 mb-2 text-center bg-light border rounded shadow-sm p-2">
                        <div className="mt-3 border rounded p-1">
                            <Label htmlFor="">Choisissez une programmation <span className="text-danger">*</span>  </Label>
                            <FilterSelect
                                options={programmations?.map((pr) => ({ id: pr.id, label: `${pr.code} | Programmée: ${pr.qteProgrammer}` }))}
                                handleSelect={handleProgrammationSelect}
                                selected={selectedProgrammation?.id}
                            />
                            {selectedProgrammation && (
                                <>
                                    <p className="text-center bg-dark text-white my-3">Programmation choisie : {`${selectedProgrammation.code} | Programmée:${selectedProgrammation.qteProgrammer} | Reste à Vendre:${selectedProgrammation.resteAvendre}`} </p>
                                    <button
                                        className="btn btn-sm bg-success text-white"
                                        disabled={selectedProgrammation?.resteAvendre == 0}
                                        onClick={addVente}
                                    ><span className="badge shadow-sm text-dark bg-white">➕ </span>Vendre ce bon</button>
                                </>
                            )}
                        </div>
                    </div>

                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={filteredVentes}
                            setReload={setReload}
                            date={date}
                            setDate={setDate}
                            selectedProgrammation={selectedProgrammation}
                            handleProgrammationSelect={handleProgrammationSelect}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayourt>

        {/* ajout de vente */}
        <AddVenteModal
            open={openAdd}
            onOpenChange={setOpenAdd}
            programmation={selectedProgrammation}
            handleProgrammationSelect={handleProgrammationSelect}
        />
    </>
}