'use client';

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATHS = ['/login', '/logout', '/refresh-token'];

export default function RefreshToken() {
    const pathName = usePathname();
    const router = useRouter();
    useEffect(() => {
        if (UNAUTHENTICATED_PATHS.includes(pathName)) return;

        let interval: any = null

        checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
                router.push('/login')
            }
        })
        interval = setInterval(() => checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
                router.push('/login')
            }
        }), 5000)
        return () => clearInterval(interval)
    }, [pathName, router])
    return null;
}