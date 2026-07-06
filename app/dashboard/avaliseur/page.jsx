'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import { List } from 'lucide-react';

import { columns, Avaliseur } from "./columns"
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
    const [avaliseurs, setAvaliseurs] = useState([])
    const [reload, setReload] = useState(false)

    // get avaliseurs
    const retriveAvaliseurs = async () => {
        try {
            const response = await axiosInstance.get(apiRoutes.allAvaliseur)
            return response.data
        } catch (error) {
            console.log("error lors de la recuperation des avaliseurs :", error)
        }
    }

    useEffect(() => {
        console.log("Reload state :", reload)
        // traitement...
        toast.promise(
            retriveAvaliseurs(),
            {
                loading: `Chargment des avaliseurs ...`,
                success: function (data) {
                    console.log("Data obtenu après request :", data)
                    setAvaliseurs(data)
                    return (
                        <>
                            <span className="">Chargement réussi!  </span>
                        </>
                    )
                },
                error: function (err) {
                    return err?.response?.data?.message || "Erreur de chargement des avaliseurs"
                },
            }
        )
    }, [reload])

    return <>
        <DashboardLayourt title="Liste des avaliseurs" icon={<List className="w-5 h-5" />}>
            {/* listes des avaliseurs */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={avaliseurs}
                            setReload={setReload} />
                    </div>
                </div>
            </div>
        </DashboardLayourt>
    </>
}