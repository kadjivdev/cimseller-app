import { NextResponse } from "next/server";

const cookieNames = ["access_token", "refresh_token"];

export async function POST() {
    const response = new NextResponse(null, { status: 204 });
    const cookieDomain = process.env.AUTH_COOKIE_DOMAIN || ".kadjivsarl.com";
    const cookieOptions = {
        value: "",
        maxAge: 0,
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
    };

    for (const name of cookieNames) {
        response.cookies.set({ name, ...cookieOptions });
        if (cookieDomain) {
            response.cookies.set({ name, ...cookieOptions, domain: cookieDomain });
        }
    }

    console.log("Cookies cleared:", cookieNames.join(", "));

    return response;
}