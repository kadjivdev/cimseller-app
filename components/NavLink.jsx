"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

export default function RouteLoadingToast() {
  const pathname = usePathname()
  const toastIdRef = useRef(null)
  const showTimerRef = useRef(null)
  const safetyTimerRef = useRef(null)

  const clear = () => {
    if (showTimerRef.current) { clearTimeout(showTimerRef.current); showTimerRef.current = null }
    if (safetyTimerRef.current) { clearTimeout(safetyTimerRef.current); safetyTimerRef.current = null }
    if (toastIdRef.current) { toast.dismiss(toastIdRef.current); toastIdRef.current = null }
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const target = e.target
      if (!(target instanceof Element)) return
      const anchor = target.closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return
      if (anchor.hasAttribute("download")) return
      if (anchor.target && anchor.target !== "_self") return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return

      clear()
      // petit délai : pas de flash sur les navigations instantanées
      showTimerRef.current = setTimeout(() => {
        toastIdRef.current = toast.loading("Chargement de la page ...")
      }, 150)
      safetyTimerRef.current = setTimeout(clear, 8000)
    }

    document.addEventListener("click", handleClick, true) // ← capture
    return () => {
      document.removeEventListener("click", handleClick, true)
      clear()
    }
  }, [])

  useEffect(() => { clear() }, [pathname])

  return null
}