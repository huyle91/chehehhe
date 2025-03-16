'use client'

import Loading from "@/components/loading"
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

function RefreshToken() {

    const router = useRouter()
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refresh_token')
    const redirectPathname = searchParams.get('redirect')
    useEffect(() => {
        if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) {
            checkAndRefreshToken({
                onSuccess: () => {
                    router.push(redirectPathname || '/')
                }
            })
        } else {
            router.push('/')
        }
    }, [redirectPathname, refreshTokenFromUrl, router])
    return (
        <div><Loading /></div>
    )
}


export default function RefreshTokenPage() {
    return (
        <Suspense fallback={<div><Loading /></div>}>
            <RefreshToken />
        </Suspense>
    )
}
