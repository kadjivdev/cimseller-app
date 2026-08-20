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

export default function AnnulerProgrammationModal({ open, onOpenChange, programmation, handleBonSelect }) {
    const router = useRouter()

    if (!programmation || !open) return
    // submission
    const submitValidForm = (e) => {
        e.preventDefault()
        toast.promise(
            () => axiosInstance.post(apiRoutes.annulerProgrammation, {
                id: programmation?.id
            }),
            {
                loading: `Annulation de la programmation ${programmation?.code}  en cours ...`,
                success: (res) => {
                    console.log("Response de validation :", res.data)

                    handleBonSelect(programmation?.commandeId)
                    // fermeture du modal
                    onOpenChange(false)

                    return 'Programmation annulée avec succès!'
                },
                error: (err) => {
                    console.log("Error.response :",err.response)
                    console.log("Erreure de validation de la programmation :", err.response?.data?.error)
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
                            Cette programmation <span className="badge bg-light border rounded text-dark"> {programmation?.code}</span> sera annulée définitivement.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="d-flex justify-content-center">
                        <DialogClose asChild>
                            <Button className="shadow-sm rounded" variant="outline" onClick={() => onOpenChange(false)}><X /> Abandonner</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-danger text-white shadow-sm rounded" onClick={(e) => submitValidForm(e)}><SquareArrowRightEnter />Oui, j'annule!</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}