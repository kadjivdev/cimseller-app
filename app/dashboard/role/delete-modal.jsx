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

export default function DeleteRoleModal({ open, onOpenChange, role, setReload }) {
    const router = useRouter()

    // submition
    const submitDeleteForm = (e) => {
        e.preventDefault()
        toast.promise(
            () => axiosInstance.delete(apiRoutes.deleteRole(role.id)),
            {
                loading: `Suppression en cours du rôle ${role?.name}...`,
                success: (res) => {
                    console.log("Response de suppression :", res.data)
                    
                    setReload((prev)=>prev+1)
                    onOpenChange(false)
                    
                    return 'Rôle supprimé avec succès!'
                },
                error: (err) => err?.message || 'Erreur de chargement',
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm text-center">
                <DialogHeader>
                    <DialogTitle>Êtes-vous sûre?</DialogTitle>
                    <DialogDescription>
                        Cette action est irréversible.
                        Le rôle <span className="badge bg-light border rounded text-dark"> {role?.name}</span> sera supprimé définitivement.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="d-flex justify-content-center">
                    <DialogClose asChild>
                        <Button type="button" className="shadow-sm rounded" variant="outline" onClick={() => onOpenChange(false)}><X /> Annuler</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-danger text-white shadow-sm rounded" onClick={(e) => submitDeleteForm(e)}><SquareArrowRightEnter />Supprimer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}