import { DishStatusValues } from "@/constants/type";
import z from "zod";

const positiveIntegerSchema = z
  .string()
  .regex(/^[1-9][0-9]*$/, "Must be a positive integer greater than 0")
  .transform((val) => parseInt(val, 10));

export const DishItems = z.object({
  _id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  status: z.string(),
  image: z.string(),
  isActived: z.string(),
  category: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type DishItemsType = z.TypeOf<typeof DishItems>;

export const DishFollowRestaurantItems = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  image: z.string(),
  category: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  price: z.number().nullable(),
  isActived: z.boolean(),
  restaurantDishId: z.string(),
});

export type DishFollowRestaurantItemsType = z.TypeOf<
  typeof DishFollowRestaurantItems
>;

export const ListDishFollowRestaurantItemsRes = z.object({
  message: z.string(),
  data: z.object({
    meta: z.object({
      current: z.number(),
      limit: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
    result: z.array(DishFollowRestaurantItems),
  }),
});

export type ListDishFollowRestaurantItemsResType = z.TypeOf<
  typeof ListDishFollowRestaurantItemsRes
>;

export const DishResType = z.object({
  data: z.object({
    _id: z.string(),
    name: z.string(),
    price: z.number(),
    description: z.string(),
    status: z.string(),
    image: z.string(),
    isActived: z.string(),
    category: z.object({
      _id: z.string(),
      name: z.string(),
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  message: z.string(),
});

export type DishItemsResType = z.TypeOf<typeof DishResType>;

export const ListDish = z.object({
  message: z.string(),
  data: z.object({
    meta: z.object({
      current: z.number(),
      limit: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
    result: z.array(DishItems),
  }),
});

export type DishListResType = z.TypeOf<typeof ListDish>;

export const CreateDishForm = z.object({
  name: z.string().trim().min(2).max(255),
  description: z.string().trim().min(2).max(255),
  status: z.string().trim().min(2).max(255),
  image: z.string().trim().min(2, "please choose Image"),
  category: z.string().trim().min(2, "you have to choose"),
  restaurant: z.string().trim().min(2, "you have to choose"),
  dish: z.string(),
  price: positiveIntegerSchema,
});

export type CreateDishFormType = z.TypeOf<typeof CreateDishForm>;

export const CreateDish = z.object({
  name: z.string().trim().min(2).max(255),
  description: z.string().trim().min(2).max(255),
  image: z.string().trim().min(2, "please choose Image"),
  category: z.string().trim().min(2, "you have to choose"),
});

export type CreateDishType = z.TypeOf<typeof CreateDish>;

export const UdpateDish = z.object({
  dishId: z.string().trim().min(2).max(255),
  name: z.string().trim().min(2).max(255),
  description: z.string().trim().min(2).max(255),
  image: z.string().trim().min(2, "please choose Image"),
  category: z.object({
    _id: z.string(),
    name: z.string(),
  }),
});

export type UpdateDishType = z.TypeOf<typeof UdpateDish>;

export const UdpateDishForm = z.object({
  dishId: z.string().trim().min(2).max(255),
  name: z.string().trim().min(2).max(255),
  description: z.string().trim().min(2).max(255),
  image: z.string().trim().min(2, "please choose Image"),
  category: z.string().trim().min(2, "you have to fill it"),
});

export type UpdateDishFormType = z.TypeOf<typeof UdpateDishForm>;

///////////////////////////////////////////////////////////////////////////////////////////phần này bỏ
export const CreateDishBody = z.object({
  name: z.string().min(1).max(256),
  price: z.coerce.number().positive(),
  description: z.string().max(10000),
  image: z.string().url(),
  status: z.enum(DishStatusValues).optional(),
});

export type CreateDishBodyType = z.TypeOf<typeof CreateDishBody>;

export const DishSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.coerce.number(),
  description: z.string(),
  image: z.string(),
  status: z.enum(DishStatusValues),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DishRes = z.object({
  data: DishSchema,
  message: z.string(),
});

export type DishResType = z.TypeOf<typeof DishRes>;

export const DishListRes = z.object({
  data: z.array(DishSchema),
  message: z.string(),
});

export type DishListResType1 = z.TypeOf<typeof DishListRes>;

export const UpdateDishBody = CreateDishBody;
export type UpdateDishBodyType = CreateDishBodyType;
export const DishParams = z.object({
  id: z.coerce.number(),
});
export type DishParamsType = z.TypeOf<typeof DishParams>;
