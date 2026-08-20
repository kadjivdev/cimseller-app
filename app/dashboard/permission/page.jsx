'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import axios from "axios";
import apiRoutes from "@/api/routes";
import { List, UserKey } from 'lucide-react';

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
import { useApp } from "@/app/AppContext"

export default function index() {
    const { user } = useApp()
    const [permissions, setPermissions] = useState({})

    const isPermittedTo = (name) => {
        return user?.role?.permissions?.some((pr) => pr.name == name)
    }

    // get permissions
    const retrivePermissions = async () => {
        try {
            const response = await axiosInstance.get(apiRoutes.allPermission, { withCredentials: true })
            return response.data
        } catch (error) {
            console.log("error lors de la recuperation des permissions :", error)
        }
    }

    useEffect(() => {
        // traitement...
        toast.promise(
            retrivePermissions(),
            {
                loading: `Chargment des permissions ...`,
                success: function (data) {
                    console.log("Data obtenu après request :", data)
                    setPermissions(data)
                    return (
                        <>
                            <span className="">Chargement réussi!  </span>
                        </>
                    )
                },
                error: function (err) {
                    console.log("Console dans handleLogout :", err)
                    return err?.message || "Erreur de chargement"
                },
            }
        )
    }, [])

    return <>
        <DashboardLayourt title="Listes des permissions" icon={<UserKey />}>
            {/* listes de spermissions */}
            <div className="container mx-auto py-10">
                {isPermittedTo("permission.view") ?
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-10">
                            <DataTable data={permissions} />
                        </div>
                    </div> :
                    <p className="text-center text-danger">Vous n'êtes pas autorisé.e à acceder à cette page.</p>
                }
            </div>
        </DashboardLayourt>
    </>
}