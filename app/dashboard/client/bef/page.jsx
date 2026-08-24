'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import { CircleCheckBig, KeyRound, List } from 'lucide-react';

import { columns } from "../columns"
import { DataTable } from "../data-table"
import { useApp } from "@/app/AppContext"


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
    const { user } = useApp()

    const [zones, setZones] = useState([])
    const [status, setStatus] = useState([])

    const [clients, setClients] = useState([])
    const [reload, setReload] = useState(false)

    const isPermittedTo = (name) => {
        return user?.role?.permissions?.some((pr) => pr.name == name)
    }

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
            () => axiosInstance.get(apiRoutes.allBefClient),
            {
                loading: 'Chargement des clients befs...',
                success: (res) => {
                    console.log("Les clients befs:", res.data)
                    setClients(res.data?.filter((clt) => clt.statut?.id == 3) || [])
                    return 'Clients befs chargés avec succès'
                },
                error: (err) => err?.message || 'Erreure de chargement',
            }
        )
    }, [reload])


    return <>
        <DashboardLayourt title="Liste des Clients befs" icon={<KeyRound />}>
            {/* listes des befs */}
            {isPermittedTo("client.view") ?
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
                </div> :
                <p className="text-center text-danger">Vous n'êtes pas autorisé.e à acceder à cette page.</p>
            }
        </DashboardLayourt>
    </>
}