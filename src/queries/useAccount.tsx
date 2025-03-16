import accountApiRequest from "@/apiRequest/account"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useAccountMe = () => {
    return useQuery({
        queryKey: ["account-profile"],
        queryFn: accountApiRequest.me
    })
}

export const useUpdateMeMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.updateMe
    })
}

export const useCreateMeMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.createAccount
    })
}

export const useGetAccounts = (
  current: number,
  pageSize: number,
  { sort, filter }: { sort: string; filter: string }
) => {
  return useQuery({
    queryKey: ["accounts", current, pageSize, sort, filter],
    queryFn: async () => {
      const response = await accountApiRequest.getListUser(current, pageSize, {
        sort,
        filter,
      });
      if (!response?.payload?.data) {
        console.log("wrong useGetAccounts");
        return null;
      }
      return response.payload.data;
    },
    placeholderData: keepPreviousData
  });
};

export const useGetAccountById = (id: string) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => accountApiRequest.getUserById(id),
        enabled: !!id
    })
}

export function useDeleteMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => accountApiRequest.deleteUser(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
      }
    });
  }