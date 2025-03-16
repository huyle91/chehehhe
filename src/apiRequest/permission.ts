import http from "@/lib/http";
import {
  PermissionACreateType,
  PermissionAUpdateType,
  PermissionRequestModuleType,
  PermissionRequestType,
} from "@/schemaValidations/permission.schema";

const permissionApiRequest = {
  getAllpermission: (
    current: number,
    pageSize: number,
    option?: { filter: string; sort: string }
  ) => {
    // Build the base URL
    let url = `v1/permissions?current=${current}&limit=${pageSize}`;

    // Add the filter as a query parameter if it exists
    if (option?.filter) {
      // If option.filter exists, we URL-encode the filter string.
      url += `&qs=${encodeURIComponent(option.filter)}`;
    }

    // Add the sort as a query parameter if it exists
    if (option?.sort) {
      // URL-encode the sort string
      url += `&sort=${encodeURIComponent(option.sort)}`;
    }

    // Send the GET request with the updated URL
    return http
      .get<PermissionRequestType>(url)
      .then((response) => response.payload.data)
      .catch((error) => {
        console.error("API getAllpermission Error:", error);
        throw error;
      });
  },

  getAllPermissionByModule: () => {
    return http
      .get<PermissionRequestModuleType>("v1/permissions/by-module")
      .then((response) => {
        // console.log("API getAllPermissionByModule:", response); // Log response
        return response.payload.data; // Hoặc dữ liệu bạn cần
      })
      .catch((error) => {
        console.error("API getAllPermissionByModule Error:", error); // Log lỗi API nếu có
        throw error; // Ném lỗi để React Query xử lý
      });
  },

  createPermission: (data: PermissionACreateType) => {
    return http
      .post<PermissionRequestType>("v1/permissions", data)
      .then((response) => {
        return response;
      })
      .catch((error) => console.log("error create Permission", error));
  },

  updatePermission: (data: PermissionAUpdateType) => {
    return http
      .patch(`v1/permissions/${data._id}`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => console.log("error update Permission", error));
  },

  deletePermission: (id: string) => {
    return http
      .delete(`v1/permissions/${id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => console.log("error delete Permission", error));
  },
};

export { permissionApiRequest };
