import { Role, TokenType } from "@/constants/type";

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType];
export type RoleType = (typeof Role)[keyof typeof Role];

export interface RolePayload {
  _id: string;
  name: RoleType;
}

export interface GuestPayload {
  _id: string;
  username: string;
  role: {
    _id: string;
    name: string;
  };
  table: {
    _id: string;
    table_number: number;
  };
  restaurant: {
    _id: string;
    name: string;
  };
}

export interface RestaurantPayload {
  _id: string;
  name: string;
}

export interface TokenPayload {
  sub: string;
  iss: string;
  _id: string;
  username: string;
  email: string;
  role: RolePayload;
  restaurant: RestaurantPayload;
  tokenType: TokenTypeValue; //chua fix
  exp: number;
  iat: number;
}

export interface TableTokenPayload {
  iat: number;
  number: number;
  tokenType: (typeof TokenType)["TableToken"];
}
