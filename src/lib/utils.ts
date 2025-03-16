import { toast } from "@/components/ui/use-toast";
import envConfig from "@/config";
import {
  APIrequest,
  DishStatus,
  OrderStatus,
  Role,
  TableStatus,
} from "@/constants/type";
import { EntityError } from "@/lib/http";
import { TokenPayload } from "@/types/jwt.types";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import jwt from "jsonwebtoken";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { RoleStatus } from "../constants/type";
import authApiRequest from "@/apiRequest/auth";
import guestApiRequest from "@/apiRequest/guest";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.details.forEach((item) => {
      setError(item.property, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Error",
      description:
        error?.payload?.message ?? "Error is undefined,congratulation",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("access_token") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refresh_token") : null;

export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("access_token", value);

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("refresh_token", value);

export const removeTokenFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("access_token");
  isBrowser && localStorage.removeItem("refresh_token");
};

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  if (!accessToken || !refreshToken) return;
  const decodedAccessToken = decodeToken(accessToken);
  const decodedRefreshToken = decodeToken(refreshToken);

  const now = new Date().getTime() / 1000 - 1;

  if (decodedRefreshToken.exp <= now) {
    removeTokenFromLocalStorage();
    return param?.onError && param.onError();
  }

  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    try {
      const role = decodedRefreshToken.role;
      const res =
        role.name === Role.Customer
          ? await guestApiRequest.refreshToken()
          : await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.access_token);
      setRefreshTokenToLocalStorage(res.payload.data.refresh_token);
      param?.onSuccess && param.onSuccess();
    } catch {
      param?.onError && param.onError();
    }
  }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang nấu";
    default:
      return "Từ chối";
  }
};

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};

export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token
  );
};

export function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase())
  );
};

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(
    date instanceof Date ? date : new Date(date),
    "HH:mm:ss dd/MM/yyyy"
  );
};

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), "HH:mm:ss");
};

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
};

export const getMethodAPI = (
  status: (typeof APIrequest)[keyof typeof APIrequest]
) => {
  switch (status) {
    case APIrequest.Get:
      return "Get";
    case APIrequest.Post:
      return "Post";
    case APIrequest.Put:
      return "Put";
    case APIrequest.Patch:
      return "Patch";
    case APIrequest.Delete:
      return "Delete";
    default:
      return "Get";
  }
};

export const getRoleValue = (
  status: (typeof RoleStatus)[keyof typeof RoleStatus]
) => {
  switch (status) {
    case RoleStatus.Active:
      return "Active";
    case RoleStatus.Inactive:
      return "Inactive";
    default:
      return "Active";
  }
};
