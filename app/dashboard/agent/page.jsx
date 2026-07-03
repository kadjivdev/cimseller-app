'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import { List } from 'lucide-react';

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
    const [agents, setAgents] = useState([])
    const [reload, setReload] = useState(false)

    // get agents
    const retriveAgents = async () => {
        try {
            const response = await axiosInstance.get(apiRoutes.allAgent)
            return response.data
        } catch (error) {
            console.log("error lors de la recuperation des agents :", error)
        }
    }

    useEffect(() => {
        console.log("Reload state :", reload)
        // traitement...
        toast.promise(
            retriveAgents(),
            {
                loading: `Chargment des agents ...`,
                success: function (data) {
                    console.log("Data obtenu après request :", data)
                    setAgents(data)
                    return (
                        <>
                            <span className="">Chargement réussi!  </span>
                        </>
                    )
                },
                error: function (err) {
                    return err?.response?.data?.message || "Erreur de chargement des agents"
                },
            }
        )
    }, [reload])

    return <>
        <DashboardLayourt title="Liste des agents">
            {/* listes des agents */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={agents}
                            setReload={setReload} />
                    </div>
                </div>
            </div>
        </DashboardLayourt>
    </>
}