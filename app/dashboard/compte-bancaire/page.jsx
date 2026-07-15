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
    const [compteBancaires, setCompteBancaires] = useState([])
    const [banques, setBanques] = useState([])
    const [reload, setReload] = useState(false)

    // get banques
    const retriveBanques = async () => {
        try {
            const response = await axiosInstance.get(apiRoutes.allBanque)
            return response.data
        } catch (error) {
            console.log("error lors de la recuperation des banques :", error)
        }
    }

     // get compte bancaires
    const retriveCompteBancaires = async () => {
        try {
            const response = await axiosInstance.get(apiRoutes.allCompteBancaire)
            return response.data
        } catch (error) {
            console.log("error lors de la recuperation des comptes bancaires :", error)
        }
    }


    useEffect(() => {
        console.log("Reload state :", reload)
        // traitement...
        // chargement des banques
        toast.promise(
            retriveBanques(),
            {
                loading: `Chargment des banques ...`,
                success: function (data) {
                    console.log("Les banques obtenues :", data)
                    setBanques(data)
                    return (
                        <>
                            <span className="">Chargement des banques réussi!  </span>
                        </>
                    )
                },
                error: function (err) {
                    return err?.message || "Erreur de chargement des representants"
                },
            }
        )

        // chargement des comptes bancaires
        toast.promise(
            retriveCompteBancaires(),
            {
                loading: `Chargment des comptes bancaires ...`,
                success: function (data) {
                    console.log("Les comptes bancaires :", data)
                    setCompteBancaires(data)
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
        <DashboardLayourt title="Liste des comptes bancaires" icon={<List/>}>
            {/* listes des comptes bancaires */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-10">
                        <DataTable
                            data={compteBancaires}
                            setReload={setReload} 
                            banques={banques}/>
                    </div>
                </div>
            </div>
        </DashboardLayourt>
    </>
}