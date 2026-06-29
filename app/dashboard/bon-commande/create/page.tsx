'use client'
import DashboardLayourt from "@/app/dashboard/dashboardLoyourt1";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Create() {
    useEffect(() => {
        toast(<span className="d-flex"><Spinner className="mx-2" /> Creation des commandes ... </span>)
    })
    return <>
        <DashboardLayourt>
            <h3 className="text-center">Create Bon de commande</h3>
        </DashboardLayourt>
    </>
}                                                                                   