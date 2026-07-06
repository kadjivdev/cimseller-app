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

export default function DeleteFournisseurModal({ open, onOpenChange, fournisseur, setReload }) {
    const router = useRouter()

    // submission
    const submitDeleteForm = (e) => {
        e.preventDefault()
        toast.promise(
            () => axiosInstance.delete(apiRoutes.updateFournisseur(fournisseur.id)),
            {
                loading: `Suppression en cours du fournisseur ${fournisseur?.raison_sociale}...`,
                success: (data) => {
                    console.log("Response de suppression :", data)
                   
                    setReload(true)
                    router.push(routes.fournisseur?.list)
                    router.refresh() // 👈 recharge les données server-side sans full reload
                    // fermeture du modal
                    onOpenChange(false)
                    return 'Fournisseur supprimé avec succès!'
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
                            Le fournisseur <span className="badge bg-light border rounded text-dark"> {fournisseur?.raison_sociale}</span> sera supprimé définitivement.
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