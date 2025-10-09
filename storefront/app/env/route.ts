export async function GET(request: Request) {
    const env = {
        NEXT_PUBLIC_AZURE_CLIENT_ID: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
        NEXT_PUBLIC_AZURE_B2C_AUTHORITY: process.env.NEXT_PUBLIC_AZURE_B2C_AUTHORITY,
        NEXT_PUBLIC_AZURE_B2C_KNOWN_AUTHORITY: process.env.NEXT_PUBLIC_AZURE_B2C_KNOWN_AUTHORITY,
        NEXT_PUBLIC_REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI,
        NEXT_PUBLIC_AZURE_TENANT_ID: process.env.NEXT_PUBLIC_AZURE_TENANT_ID,
    }

    return new Response(JSON.stringify(env), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}