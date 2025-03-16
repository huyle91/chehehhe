import { z } from "zod";

const positiveIntegerSchema = z
  .union([
    z.string().regex(/^[1-9][0-9]*$/, "Must be a positive integer greater than 0"),
    z.number().int().positive(),
  ])
  .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val));

export const ItemDishRestaurant = z.object({
  _id: z.string(),
  restaurant: z.string(),
  dish: z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    image: z.string(),
    category: z.object({
      _id: z.string(),
      name: z.string(),
    }),
  }),
  price: z.number(),
  isActived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ItemMenuRestaurant = z.object({
  _id: z.string(),
  restaurant: z.string(),
  dish: z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    image: z.string(),
    category: z.object({
      _id: z.string(),
      name: z.string(),
    }),
  }),
  price: z.number(),
  isActived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ItemDishRestaurantType = z.TypeOf<typeof ItemDishRestaurant>;

export const ListItemDishRestaurantRes = z.object({
  message: z.string(),
  data: z.object({
    meta: z.object({
      current: z.number(),
      limit: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
    result: z.array(ItemDishRestaurant),
  }),
});

export type ListItemDishRestaurantResType = z.TypeOf<
  typeof ListItemDishRestaurantRes
>;
export const ListMenuRestaurantRes = z.object({
  message: z.string(),
  data: z.object({
    meta: z.object({
      current: z.number(),
      limit: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
    result: z.array(ItemDishRestaurant),
  }),
});

export type ListMenuRestaurantResType = z.TypeOf<
  typeof ListMenuRestaurantRes
>;

export const CreateRestaurantDish = z.object({
  restaurant: z.string().trim(),
  dish: z.string().trim(),
  price: positiveIntegerSchema,
});

export type CreateRestaurantDishType = z.TypeOf<typeof CreateRestaurantDish>;

export const UpdateRestaurantDish = z.object({
  idResDish:z.string().trim().optional(),
  restaurant: z.string().trim().optional(),
  dish: z.string().trim().optional(),
  price: positiveIntegerSchema,
  isActived: z.boolean(),
});

export type UpdateRestaurantDishType = z.TypeOf<typeof UpdateRestaurantDish>;

export const DishRestaurantRes = z.object({
  data: z.object({
    _id: z.string(),
    restaurant: z.string(),
    dish: z.string(),
    price: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  message: z.string(),
});

export type DishRestaurantResType = z.TypeOf<typeof DishRestaurantRes>;

export const MenuItem = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  category: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  price: z.number(),
  isActived: z.boolean(),
  isDeleted: z.boolean(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  restaurantDishId: z.string().nullable(), // Add this line

});

export const MenuResponse = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    meta: z.object({
      current: z.number(),
      limit: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
    result: z.array(MenuItem),
  }),
});

export type MenuItemType = z.TypeOf<typeof MenuItem>;
export type MenuResponseType = z.TypeOf<typeof MenuResponse>;

export const DishDetail = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  category: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  price: z.number(),
  isDeleted: z.boolean(),
  deletedAt: z.string().nullable(),
  createdBy: z.object({
    _id: z.string(),
    email: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
});

export const DishDetailResponse = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: DishDetail,
});

export type DishDetailType = z.TypeOf<typeof DishDetail>;
export type DishDetailResponseType = z.TypeOf<typeof DishDetailResponse>;
