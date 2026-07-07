'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import { List } from 'lucide-react';

import { columns, Payment } from "./columns"
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
    const [representants, setRepresentants] = useState([])
    const [reload, setReload] = useState(false)

    // get representants
    const retriveRepresentants = async () => {
        try {
            const response = await axiosInstance.get(apiRoutes.allRepresentant)
            return response.data
        } catch (error) {
            console.log("error lors de la recuperation des representants :", error)
        }
    }

    useEffect(() => {
        console.log("Reload state :", reload)
        // traitement...
        toast.promise(
            retriveRepresentants(),
            {
                loading: `Chargment des representants ...`,
                success: function (data) {
                    console.log("Data obtenu après request :", data)
                    setRepresentants(data)
                    return (
                        <>
                            <span className="">Chargement réussi!  </span>
                        </>
                    )
                },
                error: function (err) {
                    return err?.message || "Erreur de chargement des representants"
                },
            }
        )
    }, [reload])

    return <>
        <DashboardLayourt title="Liste des representants">
            {/* listes des zones */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={representants}
                            setReload={setReload} />
                    </div>
                </div>
            </div>
        </DashboardLayourt>
    </>
}