'use client'
import DashboardLayourt from "@/app/dashboard/dashboardLoyourt";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Create() {
     useEffect(() => {
            toast(<span className="d-flex"><Spinner className="mx-2" /> Creation des programmations ... </span>)
        })
    return <>
        <DashboardLayourt>
            <h3 className="text-center">Create programmation</h3>
        </DashboardLayourt>
    </>
}