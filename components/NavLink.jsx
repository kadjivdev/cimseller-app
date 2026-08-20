// components/NavLink.jsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

export default function NavLink({ href, children, ...props }) {
  const pathname = usePathname()
  const toastIdRef = useRef(null)

  // ferme le toast dès que la nouvelle page est effectivement affichée
  useEffect(() => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current)
      toastIdRef.current = null
    }
  }, [pathname])

  const handleClick = () => {
    toastIdRef.current = toast.loading("Chargement de la page ...")
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}