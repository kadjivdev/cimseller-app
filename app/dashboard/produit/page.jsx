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
    const [produits, setProduits] = useState([])
    const [reload, setReload] = useState(false)

    // get zones
    const retriveZones = async () => {
        try {
            const response = await axiosInstance.get(apiRoutes.allProduit)
            return response.data
        } catch (error) {
            console.log("error lors de la recuperation des produits :", error)
        }
    }

    useEffect(() => {
        console.log("Reload state :", reload)
        // traitement...
        toast.promise(
            retriveZones(),
            {
                loading: `Chargment des produits ...`,
                success: function (data) {
                    console.log("Data obtenu après request :", data)
                    setProduits(data)
                    return (
                        <>
                            <span className="">Chargement réussi!  </span>
                        </>
                    )
                },
                error: function (err) {
                    return err?.message || "Erreur de chargement des produits"
                },
            }
        )
    }, [reload])

    return <>
        <DashboardLayourt title="Liste des produits">
            {/* listes des zones */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={produits}
                            setReload={setReload} />
                    </div>
                </div>
            </div>
        </DashboardLayourt>
    </>
}