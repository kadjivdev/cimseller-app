'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import apiRoutes from "@/api/routes";
import { CircleDotDashed, List, MessageSquarePlus, Printer, ShoppingBasket, ShoppingCart } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { Label } from "@/components/ui/label"

import { DataTable } from "./data-table"

export default function index() {

    const [reload, setReload] = useState(0)
    const [open, setOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const [ventes, setVentes] = useState([])
    const [selectedVente, setSelectedVente] = useState(null)

    // filtres de données par poériode
    const [date, setDate] = useState({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    })

    //Initialization des données
    useEffect(() => {
        // Charge des ventes
        toast.promise(
            () => axiosInstance.get(apiRoutes.allNoValidatedVente),
            {
                loading: 'Chargement des ventes ...',
                success: (res) => {
                    console.log("Les ventes :", res.data)
                    // les programmes dejà livrée etc..
                    setVentes(res.data?.filter((vt) => (!vt.validatedAt)) || [])
                    return 'Ventes chargées!'
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

    return <>
        <DashboardLayourt title="Liste des ventes en attente" icon={<CircleDotDashed />}>
            {/* listes des ventes de commande */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={filteredVentes}
                            setReload={setReload}
                            date={date}
                            setDate={setDate}
                            setReload={setReload}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayourt>

    </>
}