'use client'
import { useAppContext } from "@/components/app-provider"
import Loading from "@/components/loading"
import { getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef } from "react"

function Logout() {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
    const { setRole } = useAppContext()
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refresh_token')
    const accessTokenFromUrl = searchParams.get('access_token')
    const ref = useRef<any>(null)
    useEffect(() => {
        if (
            !ref.current &&
            ((refreshTokenFromUrl &&
                refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
                (accessTokenFromUrl &&
                    accessTokenFromUrl === localStorage.getItem('access_token'))
            )
        ) {
            ref.current = mutateAsync
            mutateAsync().then(() => {
                setTimeout(() => {
                    ref.current = null
                }, 1000)
                setRole()
                router.push('/')
            })
        } else {
            router.push('/')
        }

    }, [mutateAsync, refreshTokenFromUrl, accessTokenFromUrl, router, setRole])
    return (
        <div><Loading /></div>
    )
}

export default function LogoutPage() {
    return (
        <Suspense fallback={<div><Loading /></div>}>
            <Logout />
        </Suspense>
    )
}
