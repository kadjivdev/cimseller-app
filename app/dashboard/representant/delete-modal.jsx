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

export default function DeleteRepresentantModal({ open, onOpenChange, representant, setReload }) {
    const router = useRouter()

    // submission
    const submitDeleteForm = (e) => {
        e.preventDefault()
        toast.promise(
            () => axiosInstance.delete(apiRoutes.deleteRepresentant(representant.id)),
            {
                loading: `Suppression en cours du representant ${representant?.nom} ${representant?.prenom}...`,
                success: (res) => {
                    console.log("Response de suppression :", res.data)
                    router.push(routes.representant?.list)
                    router.refresh() // 👈 recharge les données server-side sans full reload
                    setReload(true)
                    
                    // fermeture du modal
                    onOpenChange(false)
                    // 
                    return 'Representant modifié avec succès!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
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
                            Le representant <span className="badge bg-light border rounded text-dark"> {representant?.nom} - {representant?.prenom}</span> sera supprimée définitivement.
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