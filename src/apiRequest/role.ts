import http from "@/lib/http";
import {
  RoleCreateType,
  RoleItemsGetIdType,
  RoleListItemsType,
  RoleUpdateTypeBody,
  RoleUpdateTypeBodyRes,
} from "@/schemaValidations/role.schema";

const roleApiRequest = {
  crateRole: (dataCreateRole: RoleCreateType) => {
    return http
      .post<RoleCreateType>("v1/role", dataCreateRole)
      .then((response: any) => {
        // console.log("API create role:", response); // Log response
        return response; // Hoặc dữ liệu bạn cần
      })
      .catch((error) => {
        console.error("API create role Error:", error); // Log lỗi API nếu có
        throw error; // Ném lỗi để React Query xử lý
      });
  },

  updateRole: (body: RoleUpdateTypeBody) => {
    return http.patch<RoleUpdateTypeBodyRes>(`v1/role/${body._id}`, body);
  },

  getAllRole: (
    current: number,
    pageSize: number,
    option?: { filter: string; sort: string }
  ) => {
    // Build the base URL
    let url = `v1/role?current=${current}&limit=${pageSize}`;
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

    return http
      .get<RoleListItemsType>(
        url
      )
      .then((response) => {
        // console.log("API paginate:", response); // Log response
        return response.payload.data; // Hoặc dữ liệu bạn cần
      })
      .catch((error) => {
        console.error("API get role paginate Error:", error); // Log lỗi API nếu có
        throw error; // Ném lỗi để React Query xử lý
      });
  },

  getRoleId: (id: string) => {
    return http
      .get<RoleItemsGetIdType>(`v1/role/${id}`)
      .then((response) => {
        // console.log("API paginate:", response); // Log response
        return response; // Hoặc dữ liệu bạn cần
      })
      .catch((error) => {
        console.error("API get role id Error:", error); // Log lỗi API nếu có
        throw error; // Ném lỗi để React Query xử lý
      });
  },

  deleteRole: (id: string) => {
    return http
      .delete(`v1/role/${id}`)
      .then((response: any) => {
        // console.log("API create role:", response); // Log response
        return response; // Hoặc dữ liệu bạn cần
      })
      .catch((error) => {
        console.error("API Delete role Error:", error); // Log lỗi API nếu có
        throw error; // Ném lỗi để React Query xử lý
      });
  },
};

export { roleApiRequest };

//v1/role/gfdsgfd
