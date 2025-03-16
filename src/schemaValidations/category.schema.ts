import { z } from "zod";

export const categoryItems = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CategoryItemsType = z.TypeOf<typeof categoryItems>;

export const CategoryRes = z.object({
  data: z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  message: z.string(),
});

export type CategoryResType = z.TypeOf<typeof CategoryRes>;

export const CategoryResList = z.object({
    data: z.object({
      meta: z.object({
        current: z.number(),
        pageSize: z.number(),
        pages: z.number(),
        total: z.number(),
      }),
      result: z.array(categoryItems),
    }),
    message: z.string(),
});

export type CategoryListResType = z.TypeOf<typeof CategoryResList>

export const categoryCreate = z.object({
  name: z
    .string()
    .trim()
    .min(2, "its must be greater than 2 words and not start with number")
    .max(255, "less than 255!"),
  description: z
    .string()
    .trim()
    .min(2, "its must be greater than 2 words and not start with number")
    .max(255, "less than 255!"),
});

export type CategoryCreateType = z.TypeOf<typeof categoryCreate>;

export const categoryUpdate = z.object({
  categoryId: z.string().trim().optional(),
  name: z
    .string()
    .trim()
    .min(2, "its must be greater than 2 words and not start with number")
    .max(255, "less than 255!")
    .optional(),
  description: z
    .string()
    .trim()
    .min(2, "its must be greater than 2 words and not start with number")
    .max(255, "less than 255!")
    .optional(),
});

export type CategoryUpdateType = z.TypeOf<typeof categoryUpdate>;
