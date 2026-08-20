'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import routes from "@/app/routes";
import { HandCoins, List, MessageSquarePlus } from 'lucide-react';
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
import Link from "next/link";
import { useApp } from "@/app/AppContext"

export default function index() {
    const { user } = useApp()
    const [reload, setReload] = useState(0)
    const [reglements, setReglements] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [clientId, setClientId] = useState(null)

    // filtres de données par poériode
    const [date, setDate] = useState({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    })

    const isPermittedTo = (name) => {
        return user?.role?.permissions?.some((pr) => pr.name == name)
    }

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
        <DashboardLayourt title="Liste des reglements" icon={<HandCoins />}>
            {/* listes des reglements */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    {isPermittedTo("reglement.view") ?
                        <div className="col-md-10">
                            <div className="flex justify-content-center">
                                <Link className="btn btn-md border shadow-sm rounded p-1 d-flex w-50 justify-content-center align-items-center mb-2" href={routes.reglement.create}><MessageSquarePlus className="mx-1" /> Ajouter un règlement</Link>
                            </div>
                            <DataTable
                                data={filteredReglements}
                                setReload={setReload}
                                date={date}
                                setDate={setDate}
                                totalAmount={totalAmount}
                            />
                        </div> :
                        <p className="text-center text-danger">Vous n'êtes pas autorisé.e à acceder à cette page.</p>
                    }
                </div>
            </div>
        </DashboardLayourt>
    </>
}