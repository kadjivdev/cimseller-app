"use client"

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { toast } from "sonner"
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import { useRouter } from "next/navigation"
import { PencilLine, Send, X } from "lucide-react";
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FilterSelect } from "@/myComponents/FilterSelect"

export default function UpdateVenteModal({ open, onOpenChange, vente, setReload }) {
  const router = useRouter()

  const [data, setData] = useState({ aib: 0, tva: 0, ttcPrice: 0, usinePrice: 0, marge: 0, })
  const [errors, setErrors] = useState({ aib: '', tva: '', ttcPrice: '', usinePrice: '', marge: '' })

  const [totaux, setTotaux] = useState({ usinePrixHT: 0, margePrice: 0, htPrice: 0, bruitPrice: 0, netHorsTaxe: 0, tvaPrice: 0, aibPrice: 0, prixTTC: 0 })

  const aibs = [
    { label: 'AIB Inclus (PI/1.18)', value: 1.18 },
    { label: 'AIB Inclus (PI/1.19)', value: 1.19 },
    { label: 'AIB Inclus (PI/1.23)', value: 1.23 },
  ]

  useEffect(() => {
    if (!vente || !vente.venteComptability) return
    setData({ aib: 0, tva: 0, ttcPrice: 0, usinePrice: 0, marge: 0, })
    setTotaux({ usinePrixHT: 0, margePrice: 0, htPrice: 0, bruitPrice: 0, netHorsTaxe: 0, tvaPrice: 0, aibPrice: 0, prixTTC: 0 })
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target

    if (name != "aib" && data.aib == 0) {
      toast.error("Choisissez un AIB")
      return
    }

    setData((prev) => ({
      ...prev,
      [name]: Number(value)
    }))

    // le détails
    operation()
  }

  function operation() {

    // Récupérer les taux de TVA et de marge
    const tauxHT = data.aib ?? 1.19;
    const marge = data.marge;

    // Calculer le prix HT à partir du prix usine TTC
    const prixUsineHT = (data.usinePrice / tauxHT).toFixed(2);

    // Calculer le prix avec marge
    const prixMarge = parseFloat(prixUsineHT) + parseFloat(marge);


    // Calculer le prix hors Taxe à partir du prix TTC

    let prixHt = 0;

    const PrixHTaib = (data.ttcPrice / data.aib).toFixed(2)

    prixHt = PrixHTaib

    console.log('Prix ht : ', prixHt);

    // Calculer le prix bruite à partir du prix ht
    const prixBruite = parseFloat(prixHt) * 1.18

    // Calculer le prix net hors taxe à partir du prix hors taxe
    const quantite = parseInt(vente.qteTotal);

    const prixNHT = parseFloat(prixHt) * quantite;

    //Calculer TVA à partir du net hors taxe 
    const prixTVA = parseInt(prixNHT * 0.18);

    // Calculer le prix AIB
    let prixAIBok = 0
    let prixAIB = 0

    if (data.aib == 1.23) {
      prixAIB = parseFloat((prixNHT * 5) / 100);
    }
    if (data.aib == 1.19) {
      prixAIB = parseFloat(prixNHT / 100);
    }
    if (data.aib == 1.18) {
      prixAIB = 0;
    }
    prixAIBok = prixAIB

    console.log('prixAIB', data.aib);
    console.log('prixAIBok', prixAIBok);

    //Calculer TTC 
    const prixTTC = prixNHT + prixTVA + prixAIBok;

    // Mettre à jour les éléments à l'écran
    setTotaux((prev) => (
      {
        ...prev,
        usinePrixHT: Number(prixUsineHT),
        margePrice: Number(prixMarge.toFixed(2)) ,
        htPrice: Number(prixHt),
        bruitPrice: Number(prixBruite),
        netHorsTaxe: Number(prixNHT.toFixed(2)),
        tvaPrice: Number(prixTVA.toFixed(2)),
        aibPrice: Number(prixAIBok.toFixed(2)),
        prixTTC: Number(prixTTC.toFixed(2))
      }), [])
  }

  // handle aib selection
  const handleAibSelect = (value) => {
    console.log("L'aib selectionné :", value)
    setData((prev) => ({ ...prev, aib: value }))

    operation()
  }

  // submission
  const updateVenteForm = async (e) => {
    e.preventDefault()

    const combinedData = {
      ...data,
      ...totaux
    }

    console.log("combinedData :", combinedData)
    // return
    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.updateComptabilities(vente.venteComptability?.id), combinedData),
        {
          loading: `Traitement de la vente ${vente?.code} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            setReload(true)
            // router.push(routes.vente?.aComptabiliser)
            router.refresh()
            onOpenChange(false)

            return `Vente traitée avec succès!`
          },
          error: (err) => {
            console.log("Erreur complète :", err.response?.data)
            return err?.response?.data?.error || "Erreure d'insersion de la vente"
          },
        }
      )
    } catch (error) {
      console.log("Erreur catchée :", error)
    }
  }

  // 
  useEffect(() => {
    console.log("Updated data :", data)
  }, [data])

  useEffect(() => {
    console.log("Updated totaux :", totaux)
  }, [totaux])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[800px] sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="bg-light p-1">
          <DialogTitle>
            <PencilLine />Traitement de la vente
            <span className="badge mx-1 bg-dark rounded border text-white"> {vente?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Le traitement sera définitif et irréversible! <br />
          </DialogDescription>
          <h4 className="">Montant de la vente: <span className="badge mx-1 bg-light rounded border text-dark"> {vente?.montant?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}  fcfa</span></h4>
          <table className="table table-sm pt-1">
            <tbody>
              <tr>
                <th>Prix Usine Hors Taxe:</th>
                <td>{totaux.usinePrixHT?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <th>Prix Marge:</th>
                <td >{totaux.margePrice?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <th>Prix Hors Taxe :</th>
                <td>{totaux.htPrice?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <th>Prix Bruite :</th>
                <td >{totaux.bruitPrice?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <th>Net Hors Taxe :</th>
                <td >{totaux.netHorsTaxe?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <th>TVA :</th>
                <td >{totaux.tvaPrice?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <th>AIB :</th>
                <td >{totaux.aibPrice?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <th>TTC :</th>
                <td><span className="badge bg-success">{totaux.prixTTC?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</span></td>
              </tr>
            </tbody>
          </table>
        </DialogHeader>

        <form onSubmit={updateVenteForm}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="aib">AIB <span className="text-danger">*</span>  </Label>
                <FilterSelect
                  options={aibs?.map((aib) => ({ id: aib.value, label: `${aib.label}` }))}
                  handleSelect={handleAibSelect}
                  selected={data?.aib}
                />
                {errors?.aib && <span className="text-danger">{errors?.aib}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="ttcPrice">Prix TTC <span className="text-danger">*</span>  </Label>
                <Input id="ttcPrice"
                  type="number"
                  name="ttcPrice"
                  placeholder="Ex: 75000"
                  required
                  min={1}
                  value={data.ttcPrice}
                  onChange={handleChange} />
                {errors?.ttcPrice && <span className="text-danger">{errors?.ttcPrice}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="usinePrice">Prix Usine <span className="text-danger">*</span>  </Label>
                <Input id="usinePrice"
                  type="number"
                  name="usinePrice"
                  placeholder="Ex: 75000"
                  required
                  min={1}
                  value={data.usinePrice}
                  onChange={handleChange} />
                {errors?.usinePrice && <span className="text-danger">{errors?.usinePrice}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="tva">TVA <span className="text-danger">*</span>  </Label>
                <Input id="tva"
                  type="number"
                  name="tva"
                  placeholder="Ex: 18/100"
                  required
                  min={1}
                  max={data?.tva}
                  value={data.tva}
                  onChange={handleChange} />
                {errors?.tva && <span className="text-danger">{errors?.tva}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="marge">Marge <span className="text-danger">*</span>  </Label>
                <Input id="marge"
                  type="number"
                  name="marge"
                  placeholder="Ex: 10000"
                  required
                  min={0}
                  value={data.marge}
                  onChange={handleChange} />
                {errors?.marge && <span className="text-danger">{errors?.marge}</span>}
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-content-center">
            <Button className="shadow-sm rounded bg-dark text-white" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Annuler</Button>
            <Button
              type="submit"
              className="bg-success text-white shadow-sm rounded"
            ><Send /> Envoyer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
