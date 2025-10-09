"use client"

import React, { useEffect, useMemo, useState } from "react"
import { PublicClientApplication, Configuration } from "@azure/msal-browser"
import { MsalProvider } from "@azure/msal-react"

// fetch the `/env` route the app exposes
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

export default function MsalProviderClient({ children }: { children: React.ReactNode }) {
  const [msalConfig, setMsalConfig] = useState<Configuration | null>(null)

  useEffect(() => {
    let mounted = true
    // fetch env from the server route and build the msal config
    fetchEnv().then(env => {
      if (!mounted) return
      const config: Configuration = {
        auth: {
          clientId: env?.NEXT_PUBLIC_AZURE_CLIENT_ID ?? '',
          authority: env?.NEXT_PUBLIC_AZURE_B2C_AUTHORITY ?? env?.NEXT_PUBLIC_AZURE_TENANT_ID ?? undefined,
          redirectUri: env?.NEXT_PUBLIC_REDIRECT_URI ?? window.location.origin,
          // add knownAuthorities if needed
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: false,
        }
      }
      setMsalConfig(config)
    })
    return () => { mounted = false }
  }, [])

  // only create the PCA once msalConfig is present
  const pca = useMemo(() => {
    if (!msalConfig) return null
    return new PublicClientApplication(msalConfig)
  }, [msalConfig])

  // while loading, you can show nothing or a spinner
  if (!pca) return null

  return <MsalProvider instance={pca}>{children}</MsalProvider>
}