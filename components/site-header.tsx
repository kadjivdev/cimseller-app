"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CircleUser, LogOut, MailSearch, Menu, PencilLine, ShieldUser } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "./ui/avatar";

import { useApp } from "@/app/AppContext";
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import routes from "@/app/routes"
import { Spinner } from "./ui/spinner";

export function SiteHeader() {
  const { user, logout, loading, setLoading } = useApp()
  const router = useRouter()

  // deconnexion
  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // loading...
    setLoading(true)

    // traitement...
    await toast.promise(
      logout(),
      {
        loading: "Déconnexion en cours...",
        success: function (data: {
          success: boolean
          status?: number
          message?: string
          error?: string
          errors?: Record<string, any>
        }) {

          setLoading(false)
          setTimeout(() => router.push("/"), 1000);
          return (
            <>
              <span className="">Déconnexion réussie <Spinner /> </span>
            </>
          )
        },
        error: function (err) {
          setLoading(false)

          return err?.message || "Erreur de déconnexion"
        },
      }
    )
  }

  const profil = function () {
    // redirection vers le profil
    router.push(routes.profil)
  }

  return (
    <header className="shadow-sm flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-2 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h3 className="text-base font-medium font-mono text-shadow-2xs text-shadow-sky-300">Cim<code className="text-warning">seller</code></h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="shadow-sm border">
              <AvatarImage
                width={800}
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                className="grayscale"
              />
            </Avatar>
            {/* </Button> */}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-100" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuItem disabled>
                <CircleUser />Fulname: {user ? user.fullname : "Administrateur"}
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <MailSearch />Email: {user ? user.email : "cimseller@gmail.com"}
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <ShieldUser />Rôle: {user ? user.role?.name : 'Aucun rôle'}
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                style={{ cursor: 'Pointer' }}
                onClick={profil}>
                <PencilLine />Modifier le profil
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                    <LogOut /> {loading ? 'Déconnexion ...' : 'Déconnexion'}
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûre?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abandonner</AlertDialogCancel>
                    <Button type="button"
                      className="bg-dark hover:bg-dark-200 text-white border rounded shadow-sm"
                      onClick={handleLogout}>
                      Continuer
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
