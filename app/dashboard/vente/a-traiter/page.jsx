'use client'

import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import apiRoutes from "@/api/routes";
import { HandCoins, List, Printer, ShoppingCart } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { Label } from "@/components/ui/label"

import { DataTable } from "./data-table"
import UpdateVenteModal from "./update-modal";
import { useApp } from "@/app/AppContext"

export default function index() {
    const { user } = useApp()
    const [reload, setReload] = useState(0)
    const [open, setOpen] = useState(false)

    const [ventes, setVentes] = useState([])
    const [selectedVente, setSelectedVente] = useState(null)

    const isPermittedTo = (name) => {
        return user?.role?.permissions?.some((pr) => pr.name == name)
    }

    // filtres de données par poériode
    const [date, setDate] = useState({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    })

    //Initialization des données
    useEffect(() => {
        // Charge des ventes
        toast.promise(
            () => axiosInstance.get(apiRoutes.allNoTraitedVente),
            {
                loading: 'Chargement des ventes non traitées ...',
                success: (res) => {
                    console.log("Les ventes :", res.data)
                    setVentes(res.data || [])
                    return 'Ventes chargées!'
                },
                error: (err) => err?.response?.message || 'Erreur de chargement des ventes',
            }
        )
    }, [reload])

    useEffect(() => {
        console.log("La vente selectionnée :", selectedVente)
    }, [selectedVente])


    return <>
        <DashboardLayourt title="Liste des ventes à traiter" icon={<HandCoins />}>
            {/* listes des ventes */}
            <div className="container mx-auto py-10">
                {isPermittedTo("comptabilite.view") ?
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-10">
                            <DataTable
                                data={ventes}
                                setSelectedVente={setSelectedVente}
                                setOpen={setOpen}
                            />
                        </div>
                    </div> :
                    <p className="text-center text-danger">Vous n'êtes pas autorisé.e à acceder à cette page.</p>
                }
            </div>
        </DashboardLayourt>

        {/* update vente */}
        <UpdateVenteModal
            open={open}
            onOpenChange={setOpen}
            vente={selectedVente}
            setReload={setReload}
        />
    </>
}