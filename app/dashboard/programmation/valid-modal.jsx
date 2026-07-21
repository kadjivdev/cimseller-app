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

export default function ValidProgrammationModal({ open, onOpenChange, programmation, handleBonSelect }) {
    const router = useRouter()

    if (!programmation || !open) return
    // submission
    const submitValidForm = (e) => {
        e.preventDefault()
        toast.promise(
            () => axiosInstance.post(apiRoutes.validateProgrammation(programmation.id)),
            {
                loading: `Validation de la programmation ${programmation?.code}  en cours ...`,
                success: (res) => {
                    console.log("Response de validation :", res.data)

                    router.push(routes.programmation?.list)
                    router.refresh() // 👈 recharge les données server-side sans full reload
                    handleBonSelect(programmation?.commandeId)
                    // fermeture du modal
                    onOpenChange(false)

                    return 'Programmation validée avec succès!'
                },
                error: (err) => {
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
                            Cette programmation <span className="badge bg-light border rounded text-dark"> {programmation?.code}</span> sera validée définitivement.
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