'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import routes from "@/app/routes"
import { HandCoins, List, MessageSquarePlus } from 'lucide-react';

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
     const { user} = useApp()
    const [compteBancaires, setCompteBancaires] = useState([])
    const [banques, setBanques] = useState([])
    const [reload, setReload] = useState(0)

    console.log("User agent's :", user)
    const isPermittedTo = (name) => {
        return user?.role?.permissions?.some((pr) => pr.name == name)
    }

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
        <DashboardLayourt title="Liste des comptes bancaires" icon={<HandCoins />}>
            {/* listes des comptes bancaires */}
            <div className="container mx-auto py-10">
                <div className="row d-flex justify-content-center">
                    {isPermittedTo("compteBancaire.view") ?
                        <div className="col-md-10">
                            <div className="flex justify-content-center">
                                <Link className="btn btn-md border shadow-sm rounded p-1 d-flex w-50 justify-content-center align-items-center mb-2" href={routes.compteBancaire.create}><MessageSquarePlus className="mx-1" /> Ajouter un compte bancaire</Link>
                            </div>
                            <DataTable
                                data={compteBancaires}
                                setReload={setReload}
                                banques={banques} />
                        </div> :
                        <p className="text-center text-danger">Vous n'êtes pas autorisé.e à acceder à cette page.</p>
                    }
                </div>
            </div>
        </DashboardLayourt>
    </>
}