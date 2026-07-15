'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import { List } from 'lucide-react';
import { startOfMonth, endOfMonth, addDays, isWithinInterval, startOfDay, endOfDay } from "date-fns"

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
    const [reglements, setReglements] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [clientId, setClientId] = useState(null)

    // filtres de données par poériode
    const [date, setDate] = useState({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    })

    //Initialization des données
    useEffect(() => {
        // Charge tous les reglements
        toast.promise(
            () => axiosInstance.get(apiRoutes.allReglement),
            {
                loading: 'Chargement des reglements ...',
                success: (res) => {
                    console.log("Les reglements :", res.data)
                    setReglements(res.data || [])
                    return 'Reglements chargés!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )

    }, [reload])

    // Reglements filtrés par période (recalculé automatiquement)
    const filteredReglements = useMemo(() => {
        if (!date?.from) return reglements

        const from = startOfDay(date.from)
        const to = date.to ? endOfDay(date.to) : endOfDay(date.from)

        let rglts = reglements.filter((reglement) => {
            const createdAt = new Date(reglement.createdAt)

            return clientId ?
                isWithinInterval(createdAt, { start: from, end: to }) && reglement.clientId == clientId :
                isWithinInterval(createdAt, { start: from, end: to })
        })

        // calcule du montant total des reglements
        setTotalAmount(rglts.reduce((a, reglement) => {
            return a + reglement?.montant
        }, 0))

        return rglts;
    }, [reglements, date])

    useEffect(() => {
        console.log("totalAmount :", totalAmount)
    }, [totalAmount])

    return <>
        <DashboardLayourt title="Liste des reglements" icon={<List />}>
            {/* listes des reglements */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={filteredReglements}
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