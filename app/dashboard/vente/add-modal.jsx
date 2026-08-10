"use client"

import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useMemo, useState } from "react"

import { toast } from "sonner"
import axiosInstance from "@/api/axios"
import apiRoutes from "@/api/routes"
import { useRouter } from "next/navigation"
import routes from "@/app/routes"
import { PencilLine, ShoppingCart, SquareArrowRightEnter, Trash2, X } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field"
import { FilterSelect } from "@/myComponents/FilterSelect";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function AddVenteModal({ open, onOpenChange, programmation, handleProgrammationSelect }) {
  const router = useRouter()

  const [data, setData] = useState({ programmationId: "", produitId: '', typeId: '', typeFactureVenteId: '', clientCommanderId: '', clientd: '', date: '', unitePrice: '', qteTotal: '', remise: 0, transport: 0, montant: '', destination: '', preuve: '', observation: '' })
  const [errors, setErrors] = useState({ produitId: '', typeId: '', typeFactureVenteId: '', clientCommanderId: '', clientd: '', date: '', unitePrice: '', qteTotal: '', remise: '', transport: '', destination: '', preuve: '', observation: '' })

  const [clients, setClients] = useState([])
  const [produits, setProduits] = useState([])
  const [types, setTypes] = useState([])
  const [typeFactures, setTypeFactures] = useState([])
  const [client, setClient] = useState(null)

  // initialisation des erreurs
  useEffect(() => {
    if (!open) return
    if (!programmation) return

   setData({ programmationId: "", produitId: '', typeId: '', typeFactureVenteId: '', clientCommanderId: '', clientd: '', date: '', unitePrice: '', qteTotal: '', remise: 0, transport: 0, montant: '', destination: '', preuve: '', observation: '' })

    // Charge des clients
    toast.promise(
      () => axiosInstance.get(apiRoutes.allActifClient),
      {
        loading: 'Chargement des clients actifs ...',
        success: (res) => {
          console.log("Les clients :", res.data)
          // juste les clients actifs
          setClients(res.data || [])
          return 'Clients chargés!'
        },
        error: (err) => err?.response?.message || 'Erreur de chargement des clients actifs',
      }
    )

    // Charge des produits
    toast.promise(
      () => axiosInstance.get(apiRoutes.allProduit),
      {
        loading: 'Chargement des produits ...',
        success: (res) => {
          console.log("Les produits :", res.data)
          setProduits(res.data || [])
          return 'Produits chargés!'
        },
        error: (err) => err?.response?.message || 'Erreur de chargement des produits',
      }
    )

    // Charge des types de vente
    toast.promise(
      () => axiosInstance.get(apiRoutes.typeVente),
      {
        loading: 'Chargement des types de vente ...',
        success: (res) => {
          console.log("Les types de vente :", res.data)
          // juste les types de ventes
          setTypes(res.data || [])
          return 'Types de vente chargés!'
        },
        error: (err) => err?.response?.message || 'Erreur de chargement des types de vente',
      }
    )

    // Charge des types de facture de vente
    toast.promise(
      () => axiosInstance.get(apiRoutes.typeFactureVente),
      {
        loading: 'Chargement des types de facture de vente ...',
        success: (res) => {
          console.log("Les types de facture de vente :", res.data)
          // juste les types de facture ventes
          setTypeFactures(res.data || [])
          return 'Types de facture de vente chargés!'
        },
        error: (err) => err?.response?.message || 'Erreur de chargement des types de fcature de vente',
      }
    )

    // Charge des clients de facture de vente
    toast.promise(
      () => axiosInstance.get(apiRoutes.allActifClient),
      {
        loading: 'Chargement des clients actifs ...',
        success: (res) => {
          console.log("Les clienst :", res.data)
          // juste les types de facture ventes
          setClients(res.data || [])
          return 'Clients chargés!'
        },
        error: (err) => err?.response?.message || 'Erreur de chargement des clients',
      }
    )

    setData((prev) => ({
      ...prev,
      programmationId: programmation?.id,
      remise: programmation?.remise || 0,
      montant: 0,
      qteTotal: programmation?.resteAvendre || 0,
    }))

    setErrors({
      produitId: '', typeId: '', typeFactureVenteId: '', clientCommanderId: '', clientId: '', date: '', unitePrice: '', qteTotal: '', remise: '', transport: '', destination: '', preuve: '', observation: ''
    })
  }, [open, programmation])

  // total amount
  const totalAmount = useMemo(() => {
    console.log("totalAmount updta :", data?.qteTotal * data?.transport)
    let venteAmontant = (data?.unitePrice * data?.qteTotal) - data?.remise ?? 0//qte vendue - la remise
    let transportAmount = data?.qteTotal * data?.transport// le montant de transport de chaque quantité

    setData((prev) => ({
      ...prev,
      montant: totalAmount
    }))
    return venteAmontant + transportAmount
  }, [data.qteTotal, data.remise, data.transport, data.unitePrice])

  // handle produits selection
  const handleProduitsSelect = (produitId) => {
    console.log("Le produit selectionné :", produitId)
    setData((prev) => ({ ...prev, produitId }))
  }

  // handle type selection
  const handleTypeSelect = (typeId) => {
    console.log("Le type selectionné :", typeId)
    setData((prev) => ({ ...prev, typeId }))
  }

  // handle type facture selection
  const handleTypeFactureSelect = (typeFactureVenteId) => {
    console.log("Le type selectionné :", typeFactureVenteId)
    setData((prev) => ({ ...prev, typeFactureVenteId }))
  }

  // handle client commandeur facture selection
  const handleClientCommanderSelect = (clientCommanderId) => {
    console.log("Le client commandeur selectionné :", clientCommanderId)
    setData((prev) => ({ ...prev, clientCommanderId }))
  }

  // handle client payeur facture selection
  const handleClientSelect = (clientId) => {
    console.log("Le client selectionné :", clientId)
    setData((prev) => ({ ...prev, clientId }))
    setClient(clients?.find((cl) => cl.id == clientId))
  }

  // handleChange
  const handleChange = (e) => {
    e.preventDefault()
    let { value, checked, files, type, name } = e.target
    setData((prev) => ({
      ...prev,
      [name]: type === "file"
        ? files?.[0] ?? null
        : type === "checkbox"
          ? checked
          : value,
    }))
  }

  // submission
  const submitVenteForm = async (e) => {
    e.preventDefault()
    if (totalAmount > client?.solde) return

    // ✅ construit un vrai FormData pour multer
    const formData = new FormData()
    formData.append('name', data.name)

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    try {
      await toast.promise(
        axiosInstance.post(apiRoutes.createVente, data),
        {
          loading: `Vente de la programmation ${programmation?.code} ...`,
          success: async (res) => {
            console.log("Response de mise à jour à succès:", res.data)

            router.push(routes.vente?.list)
            router.refresh()
            handleProgrammationSelect(programmation?.id)
            onOpenChange(false)

            return `Vente insérée avec succès!`
          },
          error: (err) => {
            console.log("Erreur complète :", err.response)

            if (err?.response?.status === 422) {
              const validationErrors = err.response.data?.errors
              const { produitId, typeId, typeFactureVenteId, clientCommanderId, clientId, date, unitePrice, qteTotal, remise, transport, destination, preuve, observation } = validationErrors
              setErrors({
                produitId,
                typeId: typeId?._errors?.[0],
                typeFactureVenteId: typeFactureVenteId?._errors?.[0],
                clientCommanderId: clientCommanderId?._errors?.[0],
                clientId: clientId?._errors?.[0],
                date: date?._errors?.[0],
                unitePrice: unitePrice?._errors?.[0],
                qteTotal: qteTotal?._errors?.[0],
                remise: remise?._errors?.[0],
                transport: transport?._errors?.[0],
                destination: destination?._errors?.[0],
                preuve: preuve?._errors?.[0],
                observation: observation?._errors?.[0]
              })
              return err.response.data?.message || `Erreurs de validation pour l'insersion de la vente, vérifiez le formulaire.`
            }

            return err?.response?.data?.error || "Erreure d'insersion de la vente"
          },
        }
      )
    } catch (error) {
      console.log("Erreur catchée :", error)
    }
  }

  useEffect(() => {
    console.log("Data to submit :", data)
  }, [data])

  useEffect(() => {
    console.log("Client :", client)
  }, [client])

  useEffect(() => {
    console.log("Les erreures :", errors)
  }, [errors])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[800px] sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <DialogHeader className="bg-light p-1">
          <DialogTitle>
            <ShoppingCart /> Vente de la programmation
            <span className="badge mx-1 bg-dark rounded border text-white"> {programmation?.code}</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour vendre cette programmation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitVenteForm}>

          <h5 className="">Montant total de la vente : <span className="badge bg-light shadow-sm rounded border text-success">{totalAmount?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || 0.00}</span> </h5>
          {client &&
            <h5 className="">Solde du client : <span className="badge bg-light shadow-sm rounded border text-success">{client?.solde?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || 0.00}</span> </h5>
          }

          {(totalAmount > client?.solde) &&
            <div className="alert alert-danger">Le montant total de la vente est suppérieure au solde du client.</div>
          }

          <div className="row">
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="produitId">Le produit <span className="text-danger">*</span>  </Label>
                <FilterSelect
                  options={produits?.map((pr) => ({ id: pr.id, label: `${pr.name}` }))}
                  handleSelect={handleProduitsSelect}
                  selected={data?.produitId}
                />
                {errors?.produitId && <span className="text-danger">{errors?.produitId}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="clientCommanderId">Le Client commandeur <span className="text-danger">*</span>  </Label>
                <FilterSelect
                  options={clients?.map((cl) => ({ id: cl.id, label: `${cl.raison_sociale}` }))}
                  handleSelect={handleClientCommanderSelect}
                  selected={data?.clientCommanderId}
                />
                {errors?.clientCommanderId && <span className="text-danger">{errors?.clientCommanderId}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="clientId">Le Client payeur <span className="text-danger">*</span>  </Label>
                <FilterSelect
                  options={clients?.map((cl) => ({ id: cl.id, label: `${cl.raison_sociale} | Solde : ${cl.solde?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) || 0.00}` }))}
                  handleSelect={handleClientSelect}
                  selected={data?.clientId}
                />
                {errors?.clientId && <span className="text-danger">{errors?.clientId}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="typeId">Type de vente <span className="text-danger">*</span>  </Label>
                <FilterSelect
                  options={types?.map((tp) => ({ id: tp.id, label: `${tp.name}` }))}
                  handleSelect={handleTypeSelect}
                  selected={data?.typeId}
                />
                {errors?.typeId && <span className="text-danger">{errors?.typeId}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="typeFactureVenteId">Type de facture de vente <span className="text-danger">*</span>  </Label>
                <FilterSelect
                  options={typeFactures?.map((tp) => ({ id: tp.id, label: `${tp.name}` }))}
                  handleSelect={handleTypeFactureSelect}
                  selected={data?.typeFactureVenteId}
                />
                {errors?.typeFactureVenteId && <span className="text-danger">{errors?.typeFactureVenteId}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="date">Date <span className="text-danger">*</span>  </Label>
                <Input id="date"
                  type="date"
                  name="date"
                  required
                  value={data.date}
                  onChange={handleChange} />
                {errors?.date && <span className="text-danger">{errors?.date}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="unitePrice">Prix unitaire <span className="text-danger">*</span>  </Label>
                <Input id="unitePrice"
                  type="number"
                  name="unitePrice"
                  placeholder="Ex: 75000"
                  required
                  min={1}
                  value={data.unitePrice}
                  onChange={handleChange} />
                {errors?.unitePrice && <span className="text-danger">{errors?.unitePrice}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="unitePrice">Quantité totale <span className="text-danger">*</span>  </Label>
                <Input id="qteTotal"
                  type="number"
                  name="qteTotal"
                  placeholder="Ex: 20"
                  required
                  min={1}
                  max={programmation?.resteAvendre}
                  value={data.qteTotal}
                  onChange={handleChange} />
                {errors?.qteTotal && <span className="text-danger">{errors?.qteTotal}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="remise">Remise (-) <span className="text-danger">*</span>  </Label>
                <Input id="remise"
                  type="number"
                  name="remise"
                  placeholder="Ex: 10000"
                  required
                  min={0}
                  value={data.remise}
                  onChange={handleChange} />
                {errors?.remise && <span className="text-danger">{errors?.remise}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="transport">Transport par quantité <span className="text-danger">*</span>  </Label>
                <Input id="transport"
                  type="number"
                  name="transport"
                  placeholder="Ex: 10000"
                  required
                  min={0}
                  value={data.transport}
                  onChange={handleChange} />
                {errors?.transport && <span className="text-danger">{errors?.transport}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="destination">Destination  </Label>
                <Textarea id="destination"
                  type="text"
                  name="destination"
                  placeholder="Ex: Cotonou"
                  value={data.destination}
                  onChange={handleChange} />
                {errors?.destination && <span className="text-danger">{errors?.destination}</span>}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-2">
                <Label htmlFor="observation">Observation  </Label>
                <Textarea id="observation"
                  type="text"
                  name="observation"
                  placeholder="Ex: Laissez un commanteire ici."
                  value={data.observation}
                  onChange={handleChange} />
                {errors?.observation && <span className="text-danger">{errors?.observation}</span>}
              </div>
            </div>

            <div className="col-md-12 mb-2">
              <Field>
                <FieldLabel htmlFor="preuve">Preuve de vente</FieldLabel>
                <Input
                  id="preuve"
                  type="file"
                  name="preuve"
                  onChange={(e) => handleChange(e)}
                />
              </Field>
              {errors.preuve && <span className="text-danger">{errors.preuve}</span>}
            </div>
          </div>

          <DialogFooter>
            <Button className="shadow-sm rounded" variant="outline" onClick={(e) => { e.preventDefault(), onOpenChange(false) }}><X /> Annuler</Button>
            <Button
              type="submit"
              className="bg-dark text-white shadow-sm rounded"
              disabled={totalAmount > client?.solde}
            ><SquareArrowRightEnter /> Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}