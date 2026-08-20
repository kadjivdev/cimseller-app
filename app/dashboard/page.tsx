'use client'
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"

import { AppProvider, useApp } from "../AppContext"
import { useEffect, useState } from "react"
import { LayoutDashboard } from "lucide-react"
import { toast } from "sonner"
import DashboardLayourt from "./dashboardLoyourt"
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"

export default function Page() {
  const { user } = useApp()
  console.log("user called from dashboard page :", user)

   const [stats,setStats] = useState({qteCommander:0,qteProgrammer:0,qteLivre:0,qteVendue:0})
  
   //Initialization des données
    useEffect(() => {
        // Charge tous les bons
        toast.promise(
            () => axiosInstance.get(apiRoutes.dashboard),
            {
                loading: 'Chargement des statistiques de commande ...',
                success: (res) => {
                    console.log("Les statistiques :", res.data)
                    const {qteCommander,qteProgrammer,qteLivre,qteVendue} = res.data
                    // juste les bons validé
                    setStats({
                      qteCommander,
                      qteProgrammer,
                      qteLivre,
                      qteVendue
                    })
                    return 'Statistiques chargés!'
                },
                error: (err) => err?.response?.error || 'Erreur de chargement DES statistiques',
            }
        )
    }, [])

    useEffect(()=>{
      console.log("stats changed :",stats)
    },[stats])
  return (
    <AppProvider>
      <DashboardLayourt title={"Tableau de bord"} icon={<LayoutDashboard />}>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards
              stats={stats} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayourt>
    </AppProvider>
  )
}
