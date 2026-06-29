'use client'
import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { useEffect } from "react";
import { toast } from "sonner";

export default function List() {
     useEffect(() => {
            toast(<span className="d-flex"><Spinner className="mx-2" /> Creation des commandes ... </span>)
        })
    return <>
        <DashboardLayourt>
           <h3 className="text-center">Liste des programmations</h3>
        </DashboardLayourt>
    </>
}