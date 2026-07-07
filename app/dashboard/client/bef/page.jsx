'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import { CircleCheckBig, List } from 'lucide-react';

import { columns } from "../columns"
import { DataTable } from "../data-table"

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
    const [zones, setZones] = useState([])
    const [status, setStatus] = useState([])

    const [clients, setClients] = useState([])
    const [reload, setReload] = useState(false)


    // initialisation
    useEffect(() => {
        // Charge toutes les zones
        toast.promise(
            () => axiosInstance.get(apiRoutes.allZone),
            {
                loading: 'Chargement des zones de client...',
                success: (res) => {
                    setZones(res.data || [])
                    return 'Zones chargées!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )

        // Charge tous les status de client
        toast.promise(
            () => axiosInstance.get(apiRoutes.allClientStatus),
            {
                loading: 'Chargement des status de client...',
                success: (res) => {
                    setStatus(res.data || [])
                    return 'Status de client chargés!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )

        // Charge tous les clients
        toast.promise(
            () => axiosInstance.get(apiRoutes.allClient),
            {
                loading: 'Chargement des status de client...',
                success: (res) => {
                    console.log("Les clients :", res.data)
                    setClients(res.data?.filter((clt) => clt.statut?.id == 3) || [])
                    return 'Clients chargés avec succès'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )
    }, [reload])


    return <>
        <DashboardLayourt title="Liste des Clients befs" icon={ <CircleCheckBig />}>
            {/* listes des befs */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={clients}
                            setReload={setReload}
                            zones={zones}
                            status={status} />
                    </div>
                </div>
            </div>
        </DashboardLayourt>
    </>
}