"use client"

import {
  Dialog, DialogContent,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

import { useRouter } from "next/navigation"
import { PencilLine, X } from "lucide-react";


export default function ProfilClientModal({ open, onOpenChange, client }) {
  const router = useRouter()

  useEffect(() => {
    if (!client) return
  }, [client])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            <PencilLine /> Profil de client
            <span className="mx-1 badge bg-light rounded border bg-dark text-white">{client?.raison_sociale}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="row">
          <div className="col-md-12">
            {client?.profil &&
              <img src={client.profil} alt="Profil du client" srcSet="" className="rounded"/>
            }
          </div>
        </div>

        <DialogFooter>
          <Button className="shadow-sm rounded" variant="outline" onClick={() => onOpenChange(false)}><X /> Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}