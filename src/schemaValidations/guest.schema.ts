import { OrderSchema } from "@/schemaValidations/order.schema";
import z from "zod";

export const GuestLoginBody = z
  .object({
    username: z.string().min(2).max(50),
    table: z.string(),
    token: z.string(),
  })
  .strict();

export type GuestLoginBodyType = z.TypeOf<typeof GuestLoginBody>;

export const GuestLoginRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    guest: z.object({
      _id: z.string(),
      username: z.string(),
      role: z.object({
        _id: z.string(),
        name: z.literal("Customer"),
      }),
      table: z.object({
        _id: z.string(),
        table_number: z.number(),
      }),
      restaurant: z.object({
        _id: z.string(),
        name: z.string(),
      }),
    }),
  }),
});

export type GuestLoginResType = z.TypeOf<typeof GuestLoginRes>;

export const GuestLogoutRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    acknowledged: z.boolean(),
    modifiedCount: z.number(),
    upsertedId: z.null(),
    upsertedCount: z.number(),
    matchedCount: z.number(),
  }),
});

export type GuestLogoutResType = z.TypeOf<typeof GuestLogoutRes>;

export const GuestCreateOrdersBody = z.array(
  z.object({
    dishId: z.number(),
    quantity: z.number(),
  })
);

export type GuestCreateOrdersBodyType = z.TypeOf<typeof GuestCreateOrdersBody>;

export const GuestCreateOrdersRes = z.object({
  message: z.string(),
  data: z.array(OrderSchema),
});

export type GuestCreateOrdersResType = z.TypeOf<typeof GuestCreateOrdersRes>;

export const GuestGetOrdersRes = GuestCreateOrdersRes;

export type GuestGetOrdersResType = z.TypeOf<typeof GuestGetOrdersRes>;
