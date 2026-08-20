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

export default function ValidVenteModal({ open, onOpenChange, vente, setReload }) {
    const router = useRouter()

    if (!vente || !open) return

    // submission
    const submitValidForm = (e) => {
        e.preventDefault()
        toast.promise(
            () => axiosInstance.post(apiRoutes.validateVente(vente?.id)),
            {
                loading: `Validation de la vente ${vente?.code}  en cours ...`,
                success: (res) => {
                    console.log("Response de validation :", res.data)

                    setReload((prev) => prev + 1)
                    // fermeture du modal
                    onOpenChange(false)

                    return 'Vente validée avec succès!'
                },
                error: (err) => {
                    console.log("Erreure de validation de la vente :", err.response?.data?.error)
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
                            Cette vente <span className="badge bg-light border rounded text-dark"> {vente?.code}</span> sera validée définitivement.
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