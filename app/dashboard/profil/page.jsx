"use client"
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PencilLine } from "lucide-react"
import { toast } from "sonner"
import { useApp } from "@/app/AppContext"
import DashboardLayourt from "../dashboardLoyourt"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axiosInstance from "../../../api/axios"
import { Spinner } from "@/components/ui/spinner"
import apiRoutes from "../../../api/routes"
import axios from "axios"

import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { AppProvider } from "../../AppContext";

import routes from "../../routes"

function ProfilContent() {
    const pathname = usePathname();
    const router = useRouter()
    const { user, loading, logout } = useApp()

    const [data, setData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirm_password: ""
    })

    // Sync local form state whenever the logged-in user changes
    useEffect(() => {
        if (user) {
            setData({
                fullname: user.fullname || "",
                email: user.email || "",
                password: "",
                confirm_password: ''
            })
        }
    }, [user])

    useEffect(() => {
        toast(<span className="d-flex"><Spinner className="mx-2" /> Chargement du profil ... </span>)
    }, [])

    // Generic change handler for all controlled inputs
    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    // submit
    const updateProfil = async (e) => {
        e.preventDefault()

        if (data.password && data.password !== data.confirm_password) {
            toast.error("Les mots de passe ne correspondent pas")
            return
        }

        await toast.promise(
            // ✅ Body directement, pas wrappé dans { data }
            axiosInstance.put(apiRoutes.updateUser(user.id), data),
            {
                loading: "Modification en cours...",
                success: async (res) => {
                    console.log("Succès mise à jour :", res)

                    // ✅ Attendre 2s puis déconnecter proprement
                    await new Promise((resolve) => setTimeout(resolve, 2000))

                    await toast.promise(
                        logout(),
                        {
                            loading: "Déconnexion en cours...",
                            success: () => {
                                router.push(routes.dashboard)
                                return "Compte mis à jour — Reconnectez-vous."
                            },
                            error: (err) => {
                                return err?.message || "Erreur de déconnexion"
                            },
                        }
                    )

                    return "Compte mis à jour avec succès!"
                },
                error: (err) => {
                    console.log("Erreur dans updateProfil :", err)
                    return err?.response?.data?.message || err?.message || "Erreur de modification"
                },
            }
        )
    }

    return (
        <DashboardLayourt>
            <div className="container-fluid">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-8">
                        <div className="">
                            {/* form */}
                            <form onSubmit={updateProfil}>
                                <Card className="w-full shadow-sm bg-light">
                                    <CardContent>
                                        {/* header */}
                                        <div className="d-flex justify-content-center">
                                            <Avatar size="lg" className="shadow border-warning">
                                                <AvatarImage
                                                    src="https://github.com/shadcn.png"
                                                    alt="@shadcn"
                                                    className="grayscale"
                                                />
                                            </Avatar>
                                        </div>
                                        <br />

                                        {/* fields */}
                                        <FieldGroup>
                                            <div className="row">
                                                <div className="col-md-6 mb-2">
                                                    <Field>
                                                        <FieldLabel htmlFor="fullname">
                                                            Nom complet
                                                        </FieldLabel>
                                                        <Input
                                                            id="fullname"
                                                            type="text"
                                                            placeholder="Ex: John"
                                                            autoComplete="off"
                                                            name="fullname"
                                                            value={data.fullname}
                                                            onChange={handleChange}
                                                        />
                                                        <FieldError />
                                                    </Field>
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <Field>
                                                        <FieldLabel htmlFor="email">
                                                            Email
                                                        </FieldLabel>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            placeholder="Ex: john@gmail.com"
                                                            autoComplete="off"
                                                            name="email"
                                                            value={data.email}
                                                            onChange={handleChange}
                                                        />
                                                        <FieldError />
                                                    </Field>
                                                </div>

                                                <div className="col-md-6">
                                                    <Field>
                                                        <FieldLabel htmlFor="password">
                                                            Mot de passe
                                                        </FieldLabel>
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            placeholder="Ex: **********"
                                                            autoComplete="password"
                                                            name="password"
                                                            value={data.password}
                                                            onChange={handleChange}
                                                        />
                                                        <FieldError />
                                                    </Field>
                                                </div>
                                                <div className="col-md-6">
                                                    <Field>
                                                        <FieldLabel htmlFor="confirm_password">
                                                            Confirmer le mot de passe
                                                        </FieldLabel>
                                                        <Input
                                                            id="confirm_password"
                                                            type="password"
                                                            placeholder="Ex: *******"
                                                            autoComplete="confirm_password"
                                                            name="confirm_password"
                                                            value={data.confirm_password}
                                                            onChange={handleChange}
                                                        />
                                                        <FieldError />
                                                    </Field>
                                                </div>
                                            </div>
                                        </FieldGroup>
                                    </CardContent>
                                    <CardFooter>
                                        <Field orientation="horizontal" className="d-flex justify-content-center text-center">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="rounded w-50 bg-slate-900 text-white px-5 py-2 hover:bg-slate-700 transition">
                                                <span className="flex items-center">
                                                    <PencilLine className="mx-2" />
                                                    <span>Modifier le compte {loading && '...'}</span>
                                                </span>
                                            </Button>
                                        </Field>
                                    </CardFooter>
                                </Card>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayourt>
    );
}

export default function Profil() {
    return (
        <AppProvider>
            <ProfilContent></ProfilContent>
        </AppProvider>
    )
}