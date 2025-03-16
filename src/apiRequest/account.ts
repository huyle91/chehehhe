import http from "@/lib/http";
import {
  AccountListResType,
  AccountResIdType,
  AccountResType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const accountApiRequest = {
  me: () => http.get<AccountResType>("/v1/auth/me"),
  updateMe: (body: UpdateMeBodyType) =>
    http.patch<AccountResType>(`/v1/user/${body.id}`, body),
  createAccount: (body: Omit<UpdateMeBodyType, "id">) =>
    http.post<AccountResType>("/v1/user", body),
  getListUser: (
    current: number,
    pageSize: number,
    option?: { filter: string; sort: string }
  ) => {
    let url = `v1/user?current=${current}&limit=${pageSize}`;

    if (option?.filter) {
      url += `&qs=${encodeURIComponent(option.filter)}`;
    }

    if (option?.sort) {
      url += `&sort=${encodeURIComponent(option.sort)}`;
    }
    return http.get<AccountListResType>(url);
  },

  getUserById: (id: string) => {
    return http.get<AccountResIdType>(`/v1/user/${id}`).then((response) => {
      return response.payload;
    });
  },

  deleteUser: (id: string) => {
    return http.delete<AccountResType>(`/v1/user/${id}`);
  },
};

export default accountApiRequest;
