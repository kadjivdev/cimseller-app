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

export default function index() {

    const [ventes, setVentes] = useState([])

    //Initialization des données
    useEffect(() => {
        // Charge des ventes jounalières
        toast.promise(
            () => axiosInstance.get(apiRoutes.allDallyVente),
            {
                loading: 'Chargement des ventes journalières ...',
                success: (res) => {
                    console.log("Les ventes journalières :", res.data)
                    // les ventes journalières dejà livrée etc..
                    setVentes(res.data)
                    return 'Ventes journanières chargées!'
                },
                error: (err) => err?.response?.message || 'Erreure de chargement des ventes journalières',
            }
        )
    }, [])

    return <>
        <DashboardLayourt title="Liste des ventes journalières" icon={<List />}>
            {/* listes des ventes journalière */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={ventes}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayourt>
    </>
}