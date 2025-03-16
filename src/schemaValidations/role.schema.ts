import { z } from "zod";

export const RoleItems = z.object({
  _id: z.string(),
  name: z.string(),
  // permissions: z.array(PermissionSchema),
  // isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RoleItemsType = z.TypeOf<typeof RoleItems>;

export const RoleListItems = z.object({
  data: z.object({
    meta: z.object({
      current: z.number(),
      pageSize: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
    result: z.array(
      z.object({
        _id: z.string(),
        name: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        permissions: z.array(z.string()),
      })
    ),
  }),
  message: z.string(),
});

export type RoleListItemsType = z.TypeOf<typeof RoleListItems>;

export const RoleItemsGetId = z.object({
  data: z.object({
    result: z.object({
      _id: z.string(),
      name: z.string(),
      description: z.string(),
      permissions: z.array(
        z.object({
          _id: z.string(),
          name: z.string(),
          api_path: z.string(),
          method: z.string(),
          module: z.string(),
        })
      ),
    }),
  }),
  message: z.string(),
});

export type RoleItemsGetIdType = z.TypeOf<typeof RoleItemsGetId>;
export const RoleCreate = z.object({
  name: z.string().trim().min(2, "least 2 charactor").max(255, "max is 255"),
  isActived: z.boolean().default(false),
  description: z
    .string()
    .trim()
    .min(2, "least 2 charactor")
    .max(255, "max is 255"),
  permissions: z.array(z.string()),
});

export type RoleCreateType = z.TypeOf<typeof RoleCreate>;

export const RoleUpdate = z.object({
  name: z
    .string()
    .trim()
    .min(2, "least 2 charactor")
    .max(255, "max is 255")
    .optional(),
  isActived: z.boolean().default(false).optional(),
  description: z
    .string()
    .trim()
    .min(2, "least 2 charactor")
    .max(255, "max is 255")
    .optional(),
  permissions: z.array(z.string()).optional(),
});

export type RoleUpdateType = z.TypeOf<typeof RoleUpdate>;

export const RoleUpdateBody = z.object({
  _id: z.string(),
  name: z
    .string()
    .trim()
    .min(2, "least 2 charactor")
    .max(255, "max is 255")
    .optional(),
  isActived: z.boolean().default(false),
  description: z
    .string()
    .trim()
    .min(2, "least 2 charactor")
    .max(255, "max is 255")
    .optional(),
  permissions: z.array(z.string()).optional(),
});

export type RoleUpdateTypeBody = z.TypeOf<typeof RoleUpdateBody>;

export const RoleBodyResUpdate = z.object({
  data: z.object({
    _id: z.string(),
    name: z.string(),
    permissions: z.array(z.string()),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  message: z.string(),
});

export type RoleUpdateTypeBodyRes = z.TypeOf<typeof RoleBodyResUpdate>;
