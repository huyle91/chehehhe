export const RoleStatus = {
  Active: "Active",
  Inactive: "Inactive",
} as const;

export const RoleStatusValues = [
  RoleStatus.Active,
  RoleStatus.Inactive,
] as const;

export const APIrequest = {
  Get: `GET`,
  Post: `POST`,
  Put: `PUT`,
  Delete: `DELETE`,
  Patch: `PATCH`,
} as const;

export const APIrequestValues = [
  APIrequest.Get,
  APIrequest.Post,
  APIrequest.Put,
  APIrequest.Delete,
  APIrequest.Patch,
] as const;

export const TokenType = {
  ForgotPasswordToken: "ForgotPasswordToken",
  access_token: "access_token",
  refresh_token: "refresh_token",
  TableToken: "TableToken",
} as const;

export const Role = {
  Admin: "Admin",
  Manager: "Manager",
  Staff: "Staff",
  Chef: "Chef",
  Customer: "Customer",
} as const;

export const RoleValues = [
  Role.Admin,
  Role.Manager,
  Role.Staff,
  Role.Manager,
  Role.Customer,
] as const;

export const DishStatus = {
  Available: "Available",
  Unavailable: "Unavailable",
  Hidden: "Hidden",
} as const;

export const DishStatusValues = [
  DishStatus.Available,
  DishStatus.Unavailable,
  DishStatus.Hidden,
] as const;

export const TableStatus = {
  Available: "Available",
  Hidden: "Hidden",
  Reserved: "Reserved",
} as const;

export const TableStatusValues = [
  TableStatus.Available,
  TableStatus.Hidden,
  TableStatus.Reserved,
] as const;

export const OrderStatus = {
  Pending: "Pending",
  Processing: "Processing",
  Rejected: "Rejected",
  Delivered: "Delivered",
  Paid: "Paid",
} as const;

export const OrderStatusValues = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Rejected,
  OrderStatus.Delivered,
  OrderStatus.Paid,
] as const;

export const ManagerRoom = "manager" as const;
