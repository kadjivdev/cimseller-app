// modal-collaborateur.tsx  ← juste le modal
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { SquareArrowRightEnter, X } from "lucide-react"

import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import routes from "@/app/routes"
import { useEffect} from "react"

export default function ValidBonModal({ open, onOpenChange, bon, setReload }) {
    const router = useRouter()

    if (!bon) return
    // submission
    const submitValidForm = (e) => {
        e.preventDefault()
        toast.promise(
            () => axiosInstance.post(apiRoutes.validateCommande(bon.id)),
            {
                loading: `Validation du bon ${bon?.code}  en cours ...`,
                success: (res) => {
                    console.log("Response de validation :", res.data)

                    router.push(routes.bonCommande?.list)
                    router.refresh() // 👈 recharge les données server-side sans full reload
                    setReload(true)

                    // fermeture du modal
                    onOpenChange(false)
                    return 'Bon validé avec succès!'
                },
                error: (err) =>{
                    console.log("Erreure de validation du bon :", err.response?.data?.error)
                    return err.response?.data?.error
                },
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form>
                <DialogContent className="sm:max-w-sm text-center">
                    <DialogHeader>
                        <DialogTitle>Êtes-vous sûre?</DialogTitle>
                        <DialogDescription>
                            Cette action est irréversible.
                            Ce bon <span className="badge bg-light border rounded text-dark"> {bon?.code}</span> sera validé définitivement.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="d-flex justify-content-center">
                        <DialogClose asChild>
                            <Button className="shadow-sm rounded" variant="outline" onClick={() => onOpenChange(false)}><X /> Annuler</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-success text-white shadow-sm rounded" onClick={(e) => submitValidForm(e)}><SquareArrowRightEnter />Valider</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}