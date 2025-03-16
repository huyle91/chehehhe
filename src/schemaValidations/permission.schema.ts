import z from "zod";
import { APIrequest } from "../constants/type";
export const PermissionSchema = z.object({
  _id: z.string(),
  name: z.string(),
  api_path: z.string(),
  method: z.string(),
  module: z.string(),
  isDeleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  createBy: z.object({
    _id: z.string(),
    email: z.string(),
  }),
});

export type PermisionType = z.TypeOf<typeof PermissionSchema>;

export const PermissionList = z.object({
  data: z.object({
    meta: z.object({
      current: z.number(),
      pageSize: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
    result: z.array(PermissionSchema),
  }),
  message: z.string(),
});

export type PermissionRequestType = z.TypeOf<typeof PermissionList>;

export const PermissionListModule = z.object({
  message: z.string(),
  data: z.array(
    z.object({
      module: z.string(),
      apiPermissions: z.array(PermissionSchema),
    })
  ),
});

export type PermissionRequestModuleType = z.TypeOf<typeof PermissionListModule>;

export const PermissionACreate = z.object({
  name: z.string().min(2).max(256),
  api_path: z.string().min(5).max(256),
  method: z.string(),
  module: z.string().trim().min(2).max(256),
});

export type PermissionACreateType = z.TypeOf<typeof PermissionCreate>;

export const PermissionAUpdate = z.object({
  _id: z.string(),
  name: z.string(),
  api_path: z.string(),
  method: z.string(),
  module: z.string(),
});

export type PermissionAUpdateType = z.TypeOf<typeof PermissionAUpdate>;

export const PermissionCreate = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "least 2 charactor")
      .max(256, "most 256 charactor")
      ,
    api_path: z
      .string()
      .trim()
      .min(5, "URL least 5 words")
      .max(256, "URL most 256 words").refine((value) => {
        const slashes = value.match(/\//g) || [];
        return slashes.length >= 2;
      }, { message: "Name must contain at least two '/' characters" })
      .refine((value) => !value.includes("//"), {
        message: "Consecutive '/' characters are not allowed",
      }),
    method: z
      .enum(
        [APIrequest.Get, APIrequest.Post, APIrequest.Delete, APIrequest.Patch],
        {
          message:
            "API request method is required and must be one of: GET, POST, DELETE, PATCH",
        }
      )
      .default(APIrequest.Get),

    module: z.string().min(1, { message: "Module name is required" }), // Kiểm tra chuỗi không rỗng
  })
  .strict();

export type PermissionCrateType = z.TypeOf<typeof PermissionCreate>;

export const PermissionUpdate = z
.object({

  name: z
    .string()
    .trim()
    .min(2, "least 2 charactor")
    .max(256, "most 256 charactor")
    ,
  api_path: z
    .string()
    .trim()
    .min(5, "URL least 5 words")
    .max(256, "URL most 256 words").refine((value) => {
      const slashes = value.match(/\//g) || [];
      return slashes.length >= 2;
    }, { message: "Name must contain at least two '/' characters" })
    .refine((value) => !value.includes("//"), {
      message: "Consecutive '/' characters are not allowed",
    }),
  method: z
    .enum(
      [APIrequest.Get, APIrequest.Post, APIrequest.Delete, APIrequest.Patch],
      {
        message:
          "API request method is required and must be one of: GET, POST, DELETE, PATCH",
      }
    )
    .default(APIrequest.Get),

  module: z.string().min(1, { message: "Module name is required" }), // Kiểm tra chuỗi không rỗng
})
.strict();

export type PermissionUpdateType = z.TypeOf<typeof PermissionUpdate>;


export const Delete = z.object({
  id:z.string(),
  name:z.string()
})


export type DeleteType = z.TypeOf<typeof Delete>;