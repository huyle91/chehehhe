import http from "@/lib/http";
import {
  RefreshTokenBodyType,
  RefreshTokenResType,
  Refresh_TokenResType,
} from "@/schemaValidations/auth.schema";
import {
  GuestLoginBodyType,
  GuestLoginResType,
  GuestLogoutResType,
} from "@/schemaValidations/guest.schema";

const prefix = "/v1/guest";

const guestApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,
  sLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>(prefix, body),
  login: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/api/guest/auth/login", body, {
      baseUrl: "",
    }),
  sLogout: (guestId: string) => http.patch(`${prefix}/${guestId}`, {}),
  logout: (guestId: string) =>
    http.post<GuestLogoutResType>(
      "/api/guest/auth/logout",
      { guestId },
      { baseUrl: "" }
    ),
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<Refresh_TokenResType>(`${prefix}/refresh`, body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<Refresh_TokenResType>(
      "/api/guest/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },
};

export default guestApiRequest;
