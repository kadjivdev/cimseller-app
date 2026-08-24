// components/RouteLoadingToast.jsx
"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

export default function RouteLoadingToast() {
  const pathname = usePathname()
  const toastIdRef = useRef(null)
  const timeoutRef = useRef(null)

  const dismiss = () => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current)
      toastIdRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('#')) return

      dismiss() // ferme un toast précédent s'il traîne encore

      toastIdRef.current = toast.loading("Chargement de la page ...")

      timeoutRef.current = setTimeout(() => {
        dismiss() // filet de sécurité
      }, 4000)
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      dismiss() // ✅ nettoyage si le composant se démonte
    }
  }, [])

  // fermeture normale dès que la route change réellement
  useEffect(() => {
    dismiss()
  }, [pathname])

  return null
}