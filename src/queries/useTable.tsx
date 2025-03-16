import { TablesAPIRequest } from "@/apiRequest/tables";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetListTable = (
  current: number,
  pageSize: number,
  { sort, filter }: { sort: string; filter: string }
) => {
  return useQuery({
    queryKey: ["table-manager", current, pageSize, sort, filter],
    queryFn: async () => {
      const data = await TablesAPIRequest.getAllTable(current, pageSize, {
        sort,
        filter,
      });
      if (!data) {
        console.log("wrong useGetListTable");
      } else {
        return data;
      }
    },
  });
};

export const useAddTableMutation = () => {
  return useMutation({
    mutationFn: TablesAPIRequest.createTable,
  });
};

export function useUpdateTableMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: TablesAPIRequest.UdpateTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table-manager"] });
    },
  });
}

export function useDeleteTableMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: TablesAPIRequest.DeleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["table-manager"] });
    },
  });
}
