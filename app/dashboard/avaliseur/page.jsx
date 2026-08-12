'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import routes from "@/app/routes";
import { List, MessageSquarePlus, Users } from 'lucide-react';

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
import Link from "next/link";

export default function index() {
    const [avaliseurs, setAvaliseurs] = useState([])
    const [reload, setReload] = useState(0)

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
        <DashboardLayourt title="Liste des avaliseurs" icon={<Users className="w-5 h-5" />}>
            {/* listes des avaliseurs */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <div className="flex justify-content-center">
                            <Link className="btn btn-md border shadow-sm rounded p-1 d-flex w-50 justify-content-center align-items-center mb-2" href={routes.avaliseur.create}><MessageSquarePlus className="mx-1" /> Ajouter un avaliseur</Link>
                        </div>
                        <DataTable
                            data={avaliseurs}
                            setReload={setReload} />
                    </div>
                </div>
            </div>
        </DashboardLayourt>
    </>
}