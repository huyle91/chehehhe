'use client'
import RefreshToken from '@/components/refresh-token'
import { decodeToken, getAccessTokenFromLocalStorage, removeTokenFromLocalStorage } from '@/lib/utils'
import { GuestPayload, RestaurantPayload, RolePayload } from '@/types/jwt.types'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnMount: true,
            refetchOnReconnect: true
        },
    }
})

const AppContext = createContext({
    isAuth: false,
    role: undefined as RolePayload | undefined,
    restaurant: undefined as RestaurantPayload | undefined,
    guest: undefined as GuestPayload | undefined,
    setGuest: (guest?: GuestPayload | undefined) => { },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setRole: (role?: RolePayload | undefined) => { }

})

export const useAppContext = () => {
    return useContext(AppContext)
}

export default function AppProvider({ children }: {
    children: React.ReactNode
}) {
    const [role, setRoleState] = useState<RolePayload | undefined>()
    const [restaurant, setRestaurant] = useState<RestaurantPayload | undefined>()
    const [guest, setGuest] = useState<GuestPayload | undefined>(() => {
        if (typeof window !== 'undefined') {
            const savedGuest = localStorage.getItem('guest');
            return savedGuest ? JSON.parse(savedGuest) : undefined;
        }
        return undefined;
    });

    const handleSetGuest = useCallback((guestData?: GuestPayload) => {
        setGuest(guestData);
        if (guestData) {
            localStorage.setItem('guest', JSON.stringify(guestData));
        } else {
            localStorage.removeItem('guest');
        }
    }, []);

    useEffect(() => {
        console.log("Guest in context changed:", guest);
    }, [guest]);

    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage()
        if (accessToken) {
            try {
                const decoded = decodeToken(accessToken)
                setRoleState(decoded.role)
                setRestaurant(decoded.restaurant)
            } catch {
                removeTokenFromLocalStorage()
                setRoleState(undefined)
                setRestaurant(undefined)
                setGuest(undefined)
            }
        }
    }, [])
    const setRole = useCallback((role?: RolePayload | undefined) => {
        setRoleState(role)
        if (!role) {
            removeTokenFromLocalStorage()
            setRestaurant(undefined)
            setGuest(undefined)
        }
        const accessToken = getAccessTokenFromLocalStorage()
        if (accessToken) {
            try {
                const decoded = decodeToken(accessToken)
                setRestaurant(decoded.restaurant)
            } catch {
                removeTokenFromLocalStorage()
                setRoleState(undefined)
                setRestaurant(undefined)
                setGuest(undefined)
            }
        }
    }, [])
    const isAuth = Boolean(role)
    return (
        <AppContext.Provider value={{ role, restaurant, setRole, isAuth, guest, setGuest: handleSetGuest }}>
            <QueryClientProvider client={queryClient}>
                {children}
                <RefreshToken />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AppContext.Provider>
    )
}