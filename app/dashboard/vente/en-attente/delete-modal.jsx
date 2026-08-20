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
import { useEffect } from "react"

export default function DeleteProgrammationModal({ open, onOpenChange, vente, setReload }) {
    const router = useRouter()

    useEffect(() => {
        if (!vente) return
    }, [])

    // submission
    const submitDeleteForm = (e) => {
        e.preventDefault()
        toast.promise(
            () => axiosInstance.delete(apiRoutes.deleteVente(vente.id)),
            {
                loading: `Suppression en cours de la vente ${vente?.code}...`,
                success: (res) => {
                    console.log("Response de suppression :", res.data)

                    setReload((prev) => prev + 1)
                    // fermeture du modal
                    onOpenChange(false)
                    // 
                    return 'Vente supprimée avec succès!'
                },
                error: (err) => err?.response?.data?.error || 'Erreur de chargement',
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
                            Cette vente <span className="badge bg-light border rounded text-dark"> {vente?.code}</span> sera supprimée définitivement.
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