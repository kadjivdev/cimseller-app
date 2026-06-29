// middleware.ts (à la racine du projet, au même niveau que /app)
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes publiques — accessibles sans auth
const publicRoutes = ["/"]

// Routes protégées — tout ce qui commence par /dashboard
const protectedPrefix = "/dashboard"

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Lire le cookie access_token
    const accessToken = request.cookies.get("access_token")?.value

    const isPublicRoute = publicRoutes.includes(pathname)
    const isProtectedRoute = pathname.startsWith(protectedPrefix)

    // ✅ Pas connecté + tente d'accéder à une route protégée → redirect login
    if (isProtectedRoute && !accessToken) {
        const loginUrl = new URL("/", request.url)
        loginUrl.searchParams.set("redirect", pathname) // ← optionnel : retour après login
        return NextResponse.redirect(loginUrl)
    }

    // ✅ Déjà connecté + tente d'accéder à une route publique → redirect dashboard
    if (isPublicRoute && accessToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

// ✅ Appliquer le middleware sur ces routes uniquement
export const config = {
    matcher: [
        "/",
        "/dashboard",
        "/dashboard/:path*", // ← couvre toutes les sous-routes
    ],
}