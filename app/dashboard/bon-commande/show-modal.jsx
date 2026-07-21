"use client"

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Eye, X } from "lucide-react";

export default function ShowBonModal({ open, onOpenChange, bon }) {

  if (!bon) return

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[800px] sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            <Eye /> Voir les détails du bon
            <span className="badge bg-light rounded border text-dark">{bon?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Les détails de ce bon.
          </DialogDescription>
        </DialogHeader>

        <form>
          <div className="row">
            <div className="col-md-12 mb-2">
              <Label htmlFor="reference">Reference <span className="text-danger">*</span> </Label>
              <Input id="date"
                type="text"
                name="reference"
                placeholder="Ex: GFTR56SR89"
                required
                readOnly
                value={bon.reference} />
            </div>
            <div className="col-md-12 mb-2">
              <Label htmlFor="montant">Date <span className="text-danger">*</span> </Label>
              <Input id="date"
                type="date"
                name="date"
                required
                readOnly
                value={bon.date?.split("T")?.[0]} />
            </div>
            <div className="col-md-12 mb-2">
              <Label htmlFor="fournisseurId">Fournisseur <span className="text-danger">*</span>  </Label>
              <Input id="fournisseurId"
                type="text"
                name="fournisseurId"
                required
                readOnly
                value={bon.fournisseur?.raison_sociale} />
            </div>
            <div className="col-md-12 mb-2">
              <Label htmlFor="typeId">Type <span className="text-danger">*</span>  </Label>
              <Input id="typeId"
                type="text"
                name="typeId"
                required
                readOnly
                value={bon.type?.name} />
            </div>
          </div>

          {/* les détails */}
          <div className="row">
            <div className="col-md-12">
              <div className="flex justify-between items-center">
                <h5>Les détails</h5>
              </div>

              {/*  */}
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">N°</th>
                    <th scope="col">Produit</th>
                    <th scope="col">Quantité</th>
                    <th scope="col">Prix Unitaire</th>
                    <th scope="col">Remise</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    bon.commandeDetails?.map((dt, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <th scope="row">
                          <Input id="produit"
                            type="text"
                            name="produit"
                            required
                            readOnly
                            value={dt.product?.name} />
                        </th>
                        <td>
                          <Input id="qteCommande"
                            type="number"
                            name="qteCommande"
                            placeholder="Ex: 15.0"
                            readOnly
                            required
                            value={dt.qteCommande}
                          />
                        </td>
                        <td>
                          <Input id="unitePrice"
                            type="number"
                            name="unitePrice"
                            placeholder="Ex: 75.000"
                            required
                            readOnly
                            value={dt.unitePrice}
                          />
                        </td>
                        <td>
                          <Input id="remise"
                            type="number"
                            name="remise"
                            placeholder="Ex: 1.000"
                            required
                            readOnly
                            value={dt.remise}
                          />
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter>
            <Button className="shadow-sm bg-dark text-white rounded" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Fermer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}