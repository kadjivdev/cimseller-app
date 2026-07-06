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

export default function DeleteAvaliseurModal({ open, onOpenChange, avaliseur, setReload }) {
    const router = useRouter()

    // submission
    const submitDeleteForm = (e) => {
        e.preventDefault()
        toast.promise(
            () => axiosInstance.delete(apiRoutes.deleteAvaliseur(avaliseur.id)),
            {
                loading: `Suppression en cours de l'avaliseur ${avaliseur?.fullname}...`,
                success: (data) => {
                    console.log("Response de suppression :", data)
                   
                    setReload(true)
                    router.push(routes.avaliseur?.list)
                    router.refresh() // 👈 recharge les données server-side sans full reload
                    // fermeture du modal
                    onOpenChange(false)
                    return 'Avaliseur supprimé avec succès!'
                },
                error: (err) => err.response?.data?.message || 'Erreur de chargement',
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
                            Le camion <span className="badge bg-light border rounded text-dark"> {avaliseur?.fullname}</span> sera supprimée définitivement.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="d-flex justify-content-center">
                        <DialogClose asChild>
                            <Button className="shadow-sm rounded" variant="outline" onClick={() => onOpenChange(false)}><X /> Annuler</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-danger text-white shadow-sm rounded" onClick={(e) => submitDeleteForm(e)}><SquareArrowRightEnter />Supprimer</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}