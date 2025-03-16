import { Role } from "@/constants/type";
import z from "zod";

export const AccountSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  permissions: z
    .array(
      z.object({
        _id: z.string(),
        name: z.string(),
        api_path: z.string(),
        method: z.string(),
        module: z.string(),
      })
    )
    .nullable(),
  avatar: z.string().nullable(),
  restaurant: z.object({
    _id: z.string(),
    name: z.string(),
  }),
});

export const AccountResAdmin = z.object({
  data: z.object({
    meta: z.object({
      current: z.number(),
      limit: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
    result: z.array(AccountSchema),
  }),
  message: z.string(),
});

export type AccountResTypeAdmin = z.TypeOf<typeof AccountResAdmin>;

export type AccountType = z.TypeOf<typeof AccountSchema>;

export const AccountRes = z
  .object({
    data: AccountSchema,
    message: z.string(),
  })
  .strict();

export type AccountResType = z.TypeOf<typeof AccountRes>;

//-------------------------------------------------------------
export const AccountResId = z.object({
  data: z.object({
    _id: z.string(),
    username: z.string(),
    email: z.string(),
    role: z.object({
      _id: z.string(),
      name: z.string(),
    }),
    permissions: z
      .array(
        z.object({
          _id: z.string(),
          name: z.string(),
          api_path: z.string(),
          method: z.string(),
          module: z.string(),
        })
      )
      .nullable(),
    avatar: z.string().nullable(),
    restaurant: z.object({
      _id: z.string(),
      name: z.string(),
    }),
  }),

  message: z.string(),
});

export type AccountResIdType = z.TypeOf<typeof AccountResId>;

export type AccountListResType = z.TypeOf<typeof AccountResAdmin>;

export const CreateEmployeeAccountBody = z
  .object({
    username: z.string().trim().min(2).max(256),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    password: z.string().min(6).max(100),
    role: z.string().min(1, "Role is required"),
    // gender: z.enum(['male', 'female']).optional().default('male'),
    restaurant: z.string().min(1, "Vui lòng chọn nhà hàng"), // Thêm validation
  })
  .strict()
  .superRefine(({ password }, ctx) => {
    if (!password) {
      ctx.addIssue({
        code: "custom",
        message: "Vui lòng nhập mật khẩu",
        path: ["password"],
      });
    }
  });

export type CreateEmployeeAccountBodyType = z.TypeOf<
  typeof CreateEmployeeAccountBody
>;

export const UpdateEmployeeAccountBody = z
  .object({
    username: z.string().trim().min(2).max(256),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    changePassword: z.boolean().optional(),
    password: z.string().min(6).max(100).optional(),
    confirmPassword: z.string().min(6).max(100).optional(),
    role: z.string().min(1, "Role is required"),
    // gender: z.enum(['male', 'female']).optional().default('male'),
    restaurant: z.string().optional(),
  })
  .strict()
  .superRefine(({ confirmPassword, password, changePassword }, ctx) => {
    if (changePassword) {
      if (!password || !confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Please enter new password and confirm new password",
          path: ["changePassword"],
        });
      } else if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "Password does not match",
          path: ["confirmPassword"],
        });
      }
    }
  });

export type UpdateEmployeeAccountBodyType = z.TypeOf<
  typeof UpdateEmployeeAccountBody
>;

export const UpdateMeBody = z
  .object({
    username: z.string().trim().min(2).max(256),
    avatar: z.string().url().optional(),
    id: z.string(),
  })
  .strict();

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;

export const ChangePasswordBody = z
  .object({
    oldPassword: z.string().min(6).max(100),
    newPassword: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Password does not match",
        path: ["confirmPassword"],
      });
    }
  });

export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>;

export const AccountIdParam = z.object({
  id: z.coerce.number(),
});

export type AccountIdParamType = z.TypeOf<typeof AccountIdParam>;

export const GetListGuestsRes = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      tableNumber: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  message: z.string(),
});

export type GetListGuestsResType = z.TypeOf<typeof GetListGuestsRes>;

export const GetGuestListQueryParams = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export type GetGuestListQueryParamsType = z.TypeOf<
  typeof GetGuestListQueryParams
>;

export const CreateGuestBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    tableNumber: z.number(),
  })
  .strict();

export type CreateGuestBodyType = z.TypeOf<typeof CreateGuestBody>;

export const CreateGuestRes = z.object({
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
    role: z.enum([Role.Guest]),
    tableNumber: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

export type CreateGuestResType = z.TypeOf<typeof CreateGuestRes>;
