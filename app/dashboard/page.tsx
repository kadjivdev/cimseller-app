'use client'
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import data from "./data.json"
import DashboardLayourt from "./dashboardLoyourt"
import { AppProvider, useApp } from "../AppContext"


export default function Page() {
  const { user } = useApp()
  console.log("user called from dashboard page :", user)
  return (
    <AppProvider>
      <DashboardLayourt title={"Tableau de bord"}>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </DashboardLayourt>
    </AppProvider>
  )
}
