// modal-collaborateur.tsx  ← juste le modal
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { SquareArrowRightEnter, X } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"

import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import routes from "@/app/routes"
import { useEffect, useState } from "react"

export default function ValidReglementModal({ open, onOpenChange, reglement, setReload }) {
    const router = useRouter()

    const [data, setData] = useState({ validationComment: '' })
    const [errors, setErrors] = useState({ validationComment: '' })

    // handle change
    const handleChange = (e) => {
        e.preventDefault()
        let { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        console.log("Data update :", data)
    }, [data])

    // submission
    const submitValidForm = (e) => {
        e.preventDefault()
        toast.promise(
            () => axiosInstance.post(apiRoutes.validateReglement(reglement.id, {
                validationComment: data.validationComment
            })),
            {
                loading: `Validation du reglement ${reglement?.code}  en cours ...`,
                success: (res) => {
                    console.log("Response de validation :", res.data)

                    router.push(routes.reglement?.list)
                    router.refresh() // 👈 recharge les données server-side sans full reload
                    setReload(true)

                    // fermeture du modal
                    onOpenChange(false)
                    return 'Reglement validé avec succès!'
                },
                error: (err) =>{
                    console.log("Erreure de validation de reglement :", err)
                    return err || err?.error || err?.data?.error
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
                            Ce reglement <span className="badge bg-light border rounded text-dark"> {reglement?.code}</span> sera validé définitivement.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="col-md-12 mb-2">
                        <Textarea
                            rows={1}
                            placeholder="Ex: Laissez un commentaire ..."
                            id="validationComment"
                            name="validationComment"
                            required
                            value={data.validationComment}
                            onChange={handleChange}
                        ></Textarea>
                        {errors.validationComment && <span className="text-danger">{errors.validationComment}</span>}
                    </div>
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