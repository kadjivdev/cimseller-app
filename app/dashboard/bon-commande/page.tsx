'use client'
import DashboardLayourt from "@/app/dashboard/dashboardLoyourt1";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { toast } from "sonner";

export default function BonCommande() {

    useEffect(() => {
        toast(<span className="d-flex"><Spinner className="mx-2"/> Chargement des bons de commandes ... </span>)
    })
    return <>
        <DashboardLayourt>
            <h3 className="text-center">Liste des bons de commande</h3>
        </DashboardLayourt>
    </>
}                                                                                   