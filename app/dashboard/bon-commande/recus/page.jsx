'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import apiRoutes from "@/api/routes";
import { List } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from "date-fns"

import { columns } from "./columns"
import { DataTable } from "./data-table"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function index() {

    const [reload, setReload] = useState(false)
   
    const [recus, setRecus] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)

    // filtres de données par poériode
    const [date, setDate] = useState({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    })

    //Initialization des données
    useEffect(() => {
        // Charge tous les recus
        toast.promise(
            () => axiosInstance.get(apiRoutes.allCommandeRecu),
            {
                loading: 'Chargement des recus de commande ...',
                success: (res) => {
                    console.log("Les recus :", res.data)
                    setRecus(res.data || [])
                    return 'Recus chargés!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )
    }, [reload])

    // Recus filtrés par période (recalculé automatiquement)
    const filteredRecus = useMemo(() => {
        if (!date?.from) return recus

        const from = startOfDay(date.from)
        const to = date.to ? endOfDay(date.to) : endOfDay(date.from)

        let rs = recus.filter((rc) => {
            const createdAt = new Date(rc.createdAt)
            return isWithinInterval(createdAt, { start: from, end: to })
        })

        // calcule du montant total des recus
        setTotalAmount(rs.reduce((a, b) => {
            return a + b?.montant
        }, 0))

        return rs;
    }, [recus, date])

    useEffect(() => {
        console.log("totalAmount :", totalAmount)
    }, [totalAmount])

    return <>
        <DashboardLayourt title="Liste des recus de bons de commandes" icon={<List />}>
            {/* listes des recus de bons de commande */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={filteredRecus}
                            setReload={setReload}
                            date={date}
                            setDate={setDate}
                            totalAmount={totalAmount}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayourt>
    </>
}