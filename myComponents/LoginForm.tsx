"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { UserRoundKey } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useApp } from "../app/AppContext"
import { redirect, useRouter } from "next/navigation"

type LoginResponse = {
  success: boolean
  status?: number
  message?: string
  error?: string
  errors?: Record<string, any>
}

export function LoginForm() {

  // const [loading, setLoading] = React.useState(false)
  const { login, loading, setLoading } = useApp()
  const router = useRouter()

  // Se connecter
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")
    const password = formData.get("password")

    // loading...
    setLoading(true)

    // traitement...
    await toast.promise<LoginResponse>(
      login(email, password),
      {
        loading: "Connexion en cours...",
        success: function (data: LoginResponse) {
          setLoading(false)
          console.log("Data obtenu après request :", data)

          if (data.success) {
            setTimeout(() => router.push("/dashboard"), 1000);
            return (
              <>
                <span style={{ whiteSpace: "pre-line" }}>
                  {"Vous êtes connecté.e avec succès!\nRedirection en cours"}
                </span>
                <Spinner />
              </>
            );
          }
          return data.error || data.errors?.[0] || "Erreur de connexion"
        },
        error: function (err) {
          setLoading(false)

          console.log("Console dans loginForm :", err)
          return err?.message || "Erreur de connexion"
        },
      }
    )
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardContent>
        <form id="form-rhf-demo" onSubmit={(e) => handleSubmit(e)}>
          <FieldGroup>
            <Field>
              <InputGroup className="h-auto">
                <InputGroupInput
                  id="block-start-input1"
                  type="email"
                  name="email"
                  placeholder="*************"
                  required
                />
                <InputGroupAddon align="block-start">
                  <InputGroupText>Entrez votre email ou identifiant</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <Separator />
              <InputGroup className="h-auto">
                <InputGroupInput
                  id="block-start-input2"
                  name="password"
                  placeholder="**************"
                  type="password"
                  required
                />
                <InputGroupAddon align="block-start">
                  <InputGroupText>Entrez votre mot de passe</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="text-center">
          <Button
            type="submit"
            disabled={loading}
            form="form-rhf-demo"
            className="rounded w-full bg-slate-900 text-white px-5 py-2 hover:bg-slate-700 transition">
            {loading ?
              <span className="flex items-center"><Spinner className="mx-2" /> Connexion en cours ....</span> :
              <span className="flex items-center"> <UserRoundKey className="mx-2" /> <span>Se connecter</span></span>
            }
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

