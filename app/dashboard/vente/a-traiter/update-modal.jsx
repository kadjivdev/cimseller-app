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

  const [data, setData] = useState({ usinePrice: 0, unitPriceHT: 0, unitPriceAib: 0, unitPriceTva: 0, unitPriceTtc: 0, unitPriceMarge: 0 })
  const [errors, setErrors] = useState({ unitPriceHT: '', unitPriceAib: '', unitPriceTva: '', unitPriceTtc: '', unitPriceMarge: '' })

  const [totaux, setTotaux] = useState({ priceHT: 0, priceAib: 0, priceTva: 0, priceTtc: 0, price118: 0, priceMarge: 0 })

  useEffect(() => {
    if (!vente || !vente?.venteComptability) return
    console.log("Vente de useEffect :", vente)

    let unitePrice = data.unitPriceTtc > 0 ?
      data.unitPriceTtc : vente?.unitePrice

    const unitPriceHT = unitePrice / 1.19
    const unitPriceAib = unitPriceHT / 100
    const unitPriceTva = unitPriceHT * 18 / 100
    const unitPriceTtc = unitPriceHT + unitPriceAib + unitPriceTva

    setData((prev) => ({
      ...prev,
      usinePrice: vente?.unitePrice,
      unitPriceHT, unitPriceAib, unitPriceTva, unitPriceTtc,
      // unitPriceMarge:0
    }))

    setTotaux({
      priceHT: unitPriceHT * vente?.qteTotal,
      priceAib: unitPriceAib * vente?.qteTotal,
      priceTva: unitPriceTva * vente?.qteTotal,
      priceTtc: unitPriceTtc * vente?.qteTotal,
      price118: unitPriceHT * 1.18,
      priceMarge: data.unitPriceMarge * vente?.qteTotal,
    })
    console.log("unitPriceMarge in data:", data.unitPriceMarge)

  }, [vente, data.unitPriceTtc, data.unitPriceMarge])

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target

    setData((prev) => ({
      ...prev,
      [name]: Number(value)
    }))
  }

  useEffect(() => {
    console.log("updated data :", data)
  }, [data])

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
    const quantite = parseInt(vente?.qteTotal);

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
        margePrice: Number(prixMarge.toFixed(2)),
        htPrice: Number(prixHt),
        bruitPrice: Number(prixBruite),
        netHorsTaxe: Number(prixNHT.toFixed(2)),
        tvaPrice: Number(prixTVA.toFixed(2)),
        aibPrice: Number(prixAIBok.toFixed(2)),
        prixTTC: Number(prixTTC.toFixed(2))
      }), [])
  }

  // submission
  const updateVenteForm = async (e) => {
    e.preventDefault()

    const combinedData = {
      ...data,
      ...totaux
    }

    console.log("combinedData :", combinedData)

    try {
      await toast.promise(
        axiosInstance.put(apiRoutes.updateComptabilities(vente?.venteComptability?.id), combinedData),
        {
          loading: `Traitement de la vente ${vente?.code} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            setReload((prev) => prev + 1)
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
      <DialogContent className="md:max-w-[1000px] sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="bg-light p-1">
          <DialogTitle>
            <PencilLine />Traitement de la vente
            <span className="badge mx-1 bg-dark rounded border text-white"> {vente?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Le traitement sera définitif et irréversible! <br />
          </DialogDescription>
        </DialogHeader>

        <div className="row">
          <div className="col-md-4 border rounded">
            <div className="border rounded">
              <table className="table table-sm p-2">
                <tbody>
                  <tr>
                    <th>Date de vente:</th>
                    <td>{new Date(vente?.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}</td>
                  </tr>
                  <tr>
                    <th>Client:</th>
                    <td ><span className="badge bg-light border rounded shadow-sm text-dark"> {vente?.client?.raison_sociale}</span></td>
                  </tr>
                  <tr>
                    <th>Produit:</th>
                    <td ><span className="badge bg-light border rounded shadow-sm text-dark"> {vente?.produit?.name}</span></td>
                  </tr>
                  <tr>
                    <th>Quantité :</th>
                    <td><span className="badge bg-light border rounded text-dark shadow-sm">{vente?.qteTotal?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</span></td>
                  </tr>
                  <tr>
                    <th>Prix Unitaire :</th>
                    <td ><span className="badge bg-light border rounded text-dark shadow-sm">{vente?.unitePrice?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</span></td>
                  </tr>
                  <tr>
                    <th>Transport :</th>
                    <td ><span className="badge bg-light border rounded text-dark shadow-sm">{vente?.transport?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</span></td>
                  </tr>
                  <tr>
                    <th>Montant :</th>
                    <td ><span className="badge bg-light text-dark rounded border"> {vente?.montant?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-4 border rounded">
            <form onSubmit={updateVenteForm}>
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-2">
                    <Label htmlFor="usinePrice">Prix Usine <span className="text-danger">*</span>  </Label>
                    <Input id="usinePrice"
                      type="number"
                      name="usinePrice"
                      placeholder="Ex: 75000"
                      required
                      min={1}
                      value={data.usinePrice}
                      readOnly
                      onChange={handleChange} />
                    {errors?.usinePrice && <span className="text-danger">{errors?.usinePrice}</span>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-2">
                    <Label htmlFor="unitPriceHT">Prix HT unitaire <span className="text-danger">*</span>  </Label>
                    <Input id="unitPriceHT"
                      type="number"
                      name="unitPriceHT"
                      placeholder="Ex: 75000"
                      required
                      min={1}
                      value={data.unitPriceHT}
                      readOnly
                      onChange={handleChange} />
                    {errors?.unitPriceHT && <span className="text-danger">{errors?.unitPriceHT}</span>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-2">
                    <Label htmlFor="unitPriceTtc">Prix TTC <span className="text-danger">*</span>  </Label>
                    <Input id="unitPriceTtc"
                      type="number"
                      name="unitPriceTtc"
                      placeholder="Ex: 75000"
                      required
                      min={1}
                      value={data.unitPriceTtc}
                      onChange={handleChange} />
                    {errors?.unitPriceTtc && <span className="text-danger">{errors?.unitPriceTtc}</span>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-2">
                    <Label htmlFor="unitPriceTva">TVA <span className="text-danger">*</span>  </Label>
                    <Input id="unitPriceTva"
                      type="number"
                      name="unitPriceTva"
                      placeholder="Ex: 18/100"
                      required
                      min={1}
                      max={data?.unitPriceTva}
                      value={data.unitPriceTva}
                      readOnly
                      onChange={handleChange} />
                    {errors?.unitPriceTva && <span className="text-danger">{errors?.unitPriceTva}</span>}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-2">
                    <Label htmlFor="unitPriceMarge">Marge <span className="text-danger">*</span>  </Label>
                    <Input id="unitPriceMarge"
                      type="number"
                      name="unitPriceMarge"
                      placeholder="Ex: 10000"
                      required
                      min={0}
                      value={data.unitPriceMarge}
                      onChange={handleChange} />
                    {errors?.unitPriceMarge && <span className="text-danger">{errors?.unitPriceMarge}</span>}
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-content-center">
                <Button className="shadow-sm rounded bg-dark text-white" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Annuler</Button>
                <Button
                  type="submit"
                  className="bg-success text-white shadow-sm rounded"
                ><Send /> Valider</Button>
              </DialogFooter>
            </form>
          </div>
          <div className="col-md-4 border rounded">
            <div className="border rounded">
              <table className="table table-sm pt-1">
                <tbody>
                  <tr>
                    <th>Prix Hors Taxe :</th>
                    <td>{totaux.priceHT?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <th>Prix Aib :</th>
                    <td >{totaux.priceAib?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <th>Prix Tva :</th>
                    <td >{totaux.priceTva?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <th>Prix 1.18 :</th>
                    <td >{totaux.price118?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <th>Prix marge :</th>
                    <td >{totaux.priceMarge?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <th>TTC :</th>
                    <td><span className="badge bg-success">{totaux.priceTtc?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  )
}
