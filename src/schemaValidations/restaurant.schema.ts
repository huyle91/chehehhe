import z from "zod";
const vietnamPhoneRegex =
  /^(?:\+84|0)(3[2-9]|5[2689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/;
export const RestaurantSchema = z.object({
  _id: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z
    .string()
    .trim()
    .regex(vietnamPhoneRegex, "Invalid Vietnam phone number"),
  createdAt: z.string(),
  updatedAt: z.string(),

});

export type RestaurantType = z.TypeOf<typeof RestaurantSchema>;

export const RestaurantRes = z
  .object({
    data: RestaurantSchema,
    message: z.string(),
  })
  .strict();

export type RestaurantResType = z.TypeOf<typeof RestaurantRes>;

export const RestaurantListRes = z.object({
  data: z.object({
    meta: z.object({
      current: z.number(),
      limit: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
    result: z.array(RestaurantSchema),
  }),
  message: z.string(),
});

export type RestaurantListResType = z.TypeOf<typeof RestaurantListRes>;

export const CreateRestaurantBody = z
  .object({
    name: z.string().trim().min(6).max(256),
    address: z.string().trim().min(6).max(256),
    phone: z
      .string()
      .trim()
      .regex(vietnamPhoneRegex, "Invalid Vietnam phone number"),
  })
  .strict();

export type CreateRestaurantBodyType = z.TypeOf<typeof CreateRestaurantBody>;

export const UpdateRestaurantBody = z
  .object({
    restaurantsId:z.string().optional(),
    name: z.string().trim().min(6).max(256).optional(),
    address: z.string().trim().min(6).max(256).optional(),
    phone: z
      .string()
      .trim()
      .regex(vietnamPhoneRegex, "Invalid Vietnam phone number").optional(),
  })
  .strict();

export type UpdateRestaurantBodyType = z.TypeOf<typeof UpdateRestaurantBody>;

export const RestaurantIdParam = z.object({
  id: z.string(),
});

export type RestaurantIdParamType = z.TypeOf<typeof RestaurantIdParam>;
