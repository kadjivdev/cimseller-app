'use client'
import { useEffect } from "react";
import { LoginForm } from "../myComponents/LoginForm";
import { toast, Toaster } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { AppProvider, useApp } from "./AppContext";
import routes from "@/app/routes"

export default function Home() {
  const pathname = usePathname();
  const router = useRouter()
  const { isAuthenticated, loading, initialized } = useApp()

  useEffect(() => {
    if (!initialized) return // Attendre la lecture du localStorage

    // Attendre que le contexte ait fini de s'initialiser
    if (loading) return;
    const storedUser = window.localStorage.getItem("user");
    console.log("User logged in dashboardLayourt", storedUser)

    if (storedUser) {
      toast("Vous êtes connecté.e")
      router.push(routes.dashboard)
    }
  }, [router])

  const newDate = new Date()
  return (
    <AppProvider>
      <Toaster position="top-right" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 col-sm-6 bg-dark min-h-screen flex flex-col items-center justify-center">
            <img
              className="img-fluid"
              width={500}
              src="/cimseller_animated_logo.gif" />

            <p className="text-lg mb-6 text-white text-center max-w-2xl">
              © Powered by  <code className="text-warning">Kadjiv'Sarl</code> | @ <em>{newDate.getFullYear()}</em> .
            </p>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black text-zinc-900 dark:text-white px-4">
              <h3 className="text-center text-base font-medium font-mono text-shadow-2xs text-shadow-sky-300">Bienvenue sur Cim<code className="text-warning">seller</code></h3>

              <p className="text-lg mb-6 text-center max-w-2xl">
                Le logiciel de gestion de Ciment
              </p>

              {/* form */}
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
