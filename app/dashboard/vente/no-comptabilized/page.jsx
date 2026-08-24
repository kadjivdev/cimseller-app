'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import apiRoutes from "@/api/routes";
import { List, Printer, Send, ShoppingCart } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { Label } from "@/components/ui/label"

import { DataTable } from "./data-table"
import UpdateVenteModal from "./update-modal";
import SendVentesModal from "./send-ventes-modal";

export default function index() {

    const [reload, setReload] = useState(0)
    const [open, setOpen] = useState(false)
    const [openMany, setOpenMany] = useState(false)

    const [ventes, setVentes] = useState([])
    const [selectedVente, setSelectedVente] = useState(null)

    // filtres de données par poériode
    const [date, setDate] = useState({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    })

    // Ventes filtrés par période (recalculé automatiquement)
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

    //Initialization des données
    useEffect(() => {
        toast.promise(
            () => axiosInstance.get(apiRoutes.allNoComptabilizedVente),
            {
                loading: 'Chargement des ventes non comptabilisées ...',
                success: (res) => {
                    console.log("Les ventes :", res.data)
                    setVentes(res.data || [])
                    return 'Ventes chargées!'
                },
                error: (err) => err?.response?.message || 'Erreur de chargement des ventes',
            }
        )
    }, [reload])

    useEffect(() => {
        console.log("La vente selectiuonnée :", selectedVente)
    }, [selectedVente])

    return <>
        <DashboardLayourt title="Liste des ventes à comptabiliser" icon={<Send />}>
            {/* listes des ventes */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={filteredVentes}
                            date={date}
                            setDate={setDate}
                            setSelectedVente={setSelectedVente}
                            setOpen={setOpen}

                            setOpenMany={setOpenMany}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayourt>

        {/* update vente */}
        <UpdateVenteModal
            open={open}
            onOpenChange={setOpen}
            vente={selectedVente}
            setReload={setReload}
        />

        {/* Envoie en bloc à la comptabilité */}
        <SendVentesModal
            open={openMany}
            onOpenChange={setOpenMany}
            setReload={setReload}
        />
    </>
}