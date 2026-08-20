'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import routes from "@/app/routes";
import { List, MessageSquarePlus, UsersRound } from 'lucide-react';

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
import Link from "next/link";
import { useApp } from "@/app/AppContext"

export default function index() {
    const { user } = useApp()
    const [representants, setRepresentants] = useState([])
    const [reload, setReload] = useState(0)

    const isPermittedTo = (name) => {
        return user?.role?.permissions?.some((pr) => pr.name == name)
    }

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
        <DashboardLayourt title="Liste des representants" icon={<UsersRound />}>
            {/* listes des representants */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    {isPermittedTo("representant.view") ?
                        <div className="col-md-10">
                            <div className="flex justify-content-center">
                                <Link className="btn btn-md border shadow-sm rounded p-1 d-flex w-50 justify-content-center align-items-center mb-2" href={routes.representant.create}><MessageSquarePlus className="mx-1" /> Ajouter un representant</Link>
                            </div>
                            <DataTable
                                data={representants}
                                setReload={setReload} />
                        </div> :
                        <p className="text-center text-danger">Vous n'êtes pas autorisé.e à acceder à cette page.</p>
                    }
                </div>
            </div>
        </DashboardLayourt>
    </>
}