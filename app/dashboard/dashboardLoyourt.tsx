'use client'
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppProvider, useApp } from "../AppContext"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import routes from "@/app/routes"

// Composant interne qui a accès au contexte
function DashboardContent({ title, children, icon = null }) {
    const router = useRouter()
    const { isAuthenticated, loading, initialized } = useApp()
    const newDate = new Date()

    useEffect(() => {
        if (!initialized) return // Attendre la lecture du localStorage

        // Attendre que le contexte ait fini de s'initialiser
        if (loading) return;
        // const storedUser = window.localStorage.getItem("user");

        if (!isAuthenticated) {
            console.log("routes.dashboard :", routes.dashboard)
            toast("Vous n'êtes pas connecté.e")
            router.push(routes.dashboard)
        }
    }, [isAuthenticated, loading, router])

    if (!initialized) return <h3 className="min-h-screen flex flex-col items-center justify-center bg-dark opacity-85 text-white"><Spinner className="text-warning" /> Chargement...</h3> // Ou un spinner
    if (!isAuthenticated) return null // Évite le flash du contenu protégé

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <AppSidebar variant="inset" className="rounded" />

            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main">
                        <div className="py-4 md:gap-6 md:py-6 items-center justify-between">
                            {title && (
                                <>
                                    <h3 className="text-center"> {icon??''} {title}</h3>
                                    <Separator />
                                </>
                            )}
                            {children}
                        </div>
                    </div>
                    <div className="row bg-light d-flex justify-content-center border-top px-0 m-0 py-2 shadow-sm">
                        <p className="text-center">
                            © Powered by <code className="text-warning">Kadjiv'Sarl</code> | @{" "}
                            <strong className="text-dark">{newDate.getFullYear()}</strong>
                        </p>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

// Wrapper qui fournit le contexte
export default function DashboardLayourt({ title, children,icon = null }) {
    return (
        <AppProvider>
            <DashboardContent title={title} icon={icon}>
                {children}
            </DashboardContent>
        </AppProvider>
    )
}