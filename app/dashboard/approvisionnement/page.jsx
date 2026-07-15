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
    const [approvisionnements, setApprovisionnements] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [clientId, setClientId] = useState(null)

    // filtres de données par poériode
    const [date, setDate] = useState({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    })

    //Initialization des données
    useEffect(() => {
        // Charge tous les approvisionnements
        toast.promise(
            () => axiosInstance.get(apiRoutes.allApprovisionnement),
            {
                loading: 'Chargement des approvisionnements ...',
                success: (res) => {
                    console.log("Les approvisionnements :", res.data)
                    setApprovisionnements(res.data || [])
                    return 'Approvisionnements chargés!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )
    }, [reload])

    // Approvisionnements filtrés par période (recalculé automatiquement)
    const filteredApprovisionnements = useMemo(() => {
        if (!date?.from) return approvisionnements

        const from = startOfDay(date.from)
        const to = date.to ? endOfDay(date.to) : endOfDay(date.from)

        let appros = approvisionnements.filter((approvisionnement) => {
            const createdAt = new Date(approvisionnement.createdAt)

            return clientId ?
                isWithinInterval(createdAt, { start: from, end: to }) && approvisionnement.clientId == clientId :
                isWithinInterval(createdAt, { start: from, end: to })
        })

        // calcule du montant total des reglements
        setTotalAmount(appros.reduce((a, approvisionnement) => {
            return a + approvisionnement?.montant
        }, 0))

        return appros;
    }, [approvisionnements, date])

    useEffect(() => {
        console.log("totalAmount :", totalAmount)
    }, [totalAmount])

    return <>
        <DashboardLayourt title="Liste des approvisionnements" icon={<List />}>
            {/* listes des approvisionnements */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={filteredApprovisionnements}
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