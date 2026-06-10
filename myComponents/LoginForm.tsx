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

export function LoginForm() {

  const [loading, setLoading] = React.useState(false)

  function handleSubmit(e) {
    e.preventDefault()

    // loading....
    setLoading(true)
    toast.promise<{ name: string }>(
      () => new Promise((resolve) =>
        setTimeout(() => resolve({ name: "Event" }), 2000)
      ),
      {
        loading: "Connexion en cours...",
        success: (data) => `${data.name} has been created`,
        error: "Error",
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
                  placeholder="Email ou identifiant"
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
                  placeholder="Mot de passe"
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
