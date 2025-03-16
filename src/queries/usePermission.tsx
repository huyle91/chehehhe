import { permissionApiRequest } from "@/apiRequest/permission";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetPermission = (current: number, pageSize: number,{sort,filter}:{sort:string,filter:string}) => {
  return useQuery({
    queryKey: ["permission", current, pageSize,sort,filter], //cache du lieu với key permission, và sẽ cache dữ liệu mới nếu 2 tham số thay đổi
    queryFn: async () => {
      const data = await permissionApiRequest.getAllpermission(current, pageSize,{sort,filter});
      if(!data){
       console.log("wrong useGetPermission")
      } else {
        return data;
      }
    },
    //là một function gọi api lấy toàn bộ permission
  });
};



export const useGetPermissionModule = () => {
    return useQuery({
      queryKey: ["permission-module"], //cache du lieu với key permission, và sẽ cache dữ liệu mới nếu 2 tham số thay đổi
      queryFn: () => {
        const data = permissionApiRequest.getAllPermissionByModule();
        if(!data){
         console.log("wrong useGetPermissionModule")
        } else {
          return data;
        }
      },
      //là một function gọi api lấy toàn bộ permission
    });
  };


export const useCreatePermissionMutation = () => {
  return useMutation({
    mutationFn:permissionApiRequest.createPermission
  })
}

export const useUpdatePermissionMutation = () => {
  return useMutation({
    mutationFn:permissionApiRequest.updatePermission
  })
}


export const useDeletePermissionMutation = () => {
  return useMutation({
    mutationFn:permissionApiRequest.deletePermission
  })
}
  
