import authApiRequest from "@/apiRequest/auth"
import { useMutation } from "@tanstack/react-query"

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.login,
    })
}

export const useLoginGoogleMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.loginGoogle,
    })
}

export const useLogoutMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.logout,
    })
}

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.changePassword
    })
}