import z from "zod";

export const LoginBody = z
  .object({
    username: z.string().email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = z.object({
  message: z.string(),
  data: z.object({
    user: z.object({
      _id: z.string(),
      username: z.string(),
      email: z.string(),
    }),
    access_token: z.string(),
    refresh_token: z.string(),
  }),
});

export type LoginResType = z.TypeOf<typeof LoginRes>;

export const LogoutBody = z
  .object({
    refresh_token: z.string(),
  })
  .strict();

export type LogoutBodyType = z.TypeOf<typeof LogoutBody>;

export const RefreshTokenBody = z
  .object({
    refresh_token: z.string(),
  })
  .strict();

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>;

export const refresh_tokenRes = z.object({
  message: z.string(),
  data: z.object({
    user: z.object({
      _id: z.string(),
      username: z.string(),
      email: z.string(),
    }),
    access_token: z.string(),
    refresh_token: z.string(),
  }),
});

export type Refresh_TokenResType = z.TypeOf<typeof refresh_tokenRes>;

export const RefreshTokenRes = z.object({
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
  }),
  message: z.string(),
});

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>;
