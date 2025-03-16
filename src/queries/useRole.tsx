import { roleApiRequest } from "@/apiRequest/role";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
export const useCreateRoleMutation = () => {
  return useMutation({
    mutationFn: roleApiRequest.crateRole,
  });
};

export const useUpdateRoleMutation = () => {
  return useMutation({
    mutationFn: roleApiRequest.updateRole,
  });
};


export const useGetRole = (current: number, pageSize: number,{sort,filter}:{sort:string,filter:string}) => {
  return useQuery({
    queryKey: ["role", current, pageSize,sort,filter], //cache du lieu với key permission, và sẽ cache dữ liệu mới nếu 2 tham số thay đổi
    queryFn: () => {
      const data = roleApiRequest.getAllRole(current, pageSize,{sort,filter});
      if (!data) {
        console.log("wrong useGetAllRole");
      } else {
        return data;
      }
    },

    //là một function gọi api lấy toàn bộ permission
    placeholderData: keepPreviousData,
  });
};

export const useGetRoleByID = (id: string) => {
  return useQuery({
    queryKey: ["role_id", id], //cache du lieu với key permission, và sẽ cache dữ liệu mới nếu 2 tham số thay đổi
    queryFn: () => {
      const data = roleApiRequest.getRoleId(id);
      if (!data) {
        console.log("wrong useGeRoleID");
      } else {
        return data;
      }
    },
    enabled: !!id, // Chỉ chạy khi id có giá trị hợp l
    //là một function gọi api lấy toàn bộ permission
    placeholderData: keepPreviousData,
  });
};



export const useDeleteMutation = () => {
  return useMutation({
    mutationFn: roleApiRequest.deleteRole,
  });
};
