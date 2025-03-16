import http from "@/lib/http";
import {
  AccountResType,
  ChangePasswordBodyType,
} from "@/schemaValidations/account.schema";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  Refresh_TokenResType,
  RefreshTokenBodyType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  refreshTokenReq: null as Promise<{
    status: number;
    payload: Refresh_TokenResType;
  }> | null,
  //login
  sLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/v1/auth/login", body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  sLoginGoogle: (body: { email: string }) =>
    http.post<LoginResType>("/v1/auth/login/google", body),
  loginGoogle: (body: { email: string }) =>
    http.post<LoginResType>("/api/auth/login/google", body, {
      baseUrl: "",
    }),

  //logout
  sLogout: (
    body: LogoutBodyType & {
      access_token: string;
    }
  ) =>
    http.post(
      "/v1/auth/logout",
      {
        refresh_token: body.refresh_token,
      },
      {
        headers: {
          Authorization: `Bearer ${body.access_token}`,
        },
      }
    ),
  logout: () =>
    http.post("/api/auth/logout", null, {
      baseUrl: "",
    }),

  //refresh token
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<Refresh_TokenResType>("/v1/auth/refresh", body),
  async refreshToken() {
    if (this.refreshTokenReq) {
      return this.refreshTokenReq;
    }
    this.refreshTokenReq = http.post<Refresh_TokenResType>(
      "/api/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );

    const result = await this.refreshTokenReq;
    this.refreshTokenReq = null;
    return result;
  },

  //change password
  changePassword: (body: ChangePasswordBodyType) =>
    http.patch<AccountResType>("/v1/auth/change-password", body),
};

export default authApiRequest;
