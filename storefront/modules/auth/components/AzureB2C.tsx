"use client"

import Button from "../../common/components/Button"

import { useMsal } from "@azure/msal-react"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { InteractionStatus, PopupRequest } from "@azure/msal-browser"
import { getMsalLoginRequest } from "../config/msalConfig"

async function fetchEnv(baseUrl = ''): Promise<Record<string, string | null> | null> {
  try {
    const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/env` : '/env'
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default function AzureB2C() {
    const { instance, inProgress } = useMsal()
    const router = useRouter()
    const handleLogin = async () => {
        try {

            const env = await fetchEnv()
            const msalLoginRequest: PopupRequest = {
                redirectUri: env?.NEXT_PUBLIC_REDIRECT_URI ?? window.location.origin,
                scopes: ["openid", "profile", "email", env?.NEXT_PUBLIC_API_READ_SCOPE],
            } 
            const authResult = await instance.loginPopup(msalLoginRequest)
            if (!instance || inProgress !== InteractionStatus.None) return
            if (!authResult) return

            const idToken = authResult.idToken
            const accessToken = authResult.accessToken
            if (!idToken) return

            localStorage.setItem("azure_b2c", idToken)
            localStorage.setItem("azure_access_token", accessToken)
            router.replace("/")
        } catch (err) {
            console.error("MSAL login error", err)
            router.replace("/")
        }
    }

    const handleLogout = async () => {
        localStorage.removeItem("azure_access_token")
        localStorage.removeItem("azure_b2c")
        await instance.logoutPopup()
    }

    return (
        <>
            <div className="mt-4">
                <Button
                    text="Login with Microsoft"
                    onClick={handleLogin}
                    type="button"
                    className="flex w-full justify-center rounded-md border border-transparent bg-slate-800 py-2 px-4 text-sm font-medium text-white shadow-xs hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
                />
            </div>
            <div className="mt-4">
                <Button
                    text="Logout"
                    onClick={handleLogout}
                    type="button"
                    className="flex w-full justify-center rounded-md border border-transparent bg-slate-800 py-2 px-4 text-sm font-medium text-white shadow-xs hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
                />
            </div>
        </>
    )
}