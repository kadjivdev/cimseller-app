'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import routes from "@/app/routes";
import { List, MapPin, MessageSquarePlus } from 'lucide-react';

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

export default function index() {
    const [zones, setZones] = useState([])
    const [representants, setRepresentants] = useState([])
    const [reload, setReload] = useState(0)

    // get zones
    const retriveZones = async () => {
        try {
            const response = await axiosInstance.get(apiRoutes.allZone)
            return response.data
        } catch (error) {
            console.log("error lors de la recuperation des zones :", error)
        }
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
        // chargement des representants
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
        // chargement des zones
        toast.promise(
            retriveZones(),
            {
                loading: `Chargment des zones ...`,
                success: function (data) {
                    console.log("Data obtenu après request :", data)
                    setZones(data)
                    return (
                        <>
                            <span className="">Chargement réussi!  </span>
                        </>
                    )
                },
                error: function (err) {
                    return err?.message || "Erreur de chargement des utilisateurs"
                },
            }
        )
    }, [reload])

    return <>
        <DashboardLayourt title="Liste des zones" icon={<MapPin />}>
            {/* listes des zones */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <div className="flex justify-content-center">
                            <Link className="btn btn-md border shadow-sm rounded p-1 d-flex w-50 justify-content-center align-items-center mb-2" href={routes.zone.create}><MessageSquarePlus className="mx-1" /> Ajouter une zone</Link>
                        </div>
                        <DataTable
                            data={zones}
                            setReload={setReload}
                            representants={representants} />
                    </div>
                </div>
            </div>
        </DashboardLayourt>
    </>
}