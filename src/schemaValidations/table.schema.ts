import { TableStatusValues } from "@/constants/type";
import z from "zod";
const positiveIntegerSchema = z
  .union([
    z.string().regex(/^[1-9][0-9]*$/, "Must be a positive integer greater than 0"),
    z.number().int().positive(),
  ])
  .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val));


export const TableItem = z.object({
  _id: z.string(),
  restaurant_id: z.object({
    _id:z.string(),
    name:z.string()
  }),
  token: z.string(),
  capacity: z.number(),
  table_number: z.number(),
  status: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TableItemType = z.TypeOf<typeof TableItem>;

export const TableItemsRes = z.object({
  data: TableItem,
  message: z.string(),
});

export type TableItemsResType = z.TypeOf<typeof TableItemsRes>;

export const TableListItemsRes = z.object({
  data: z.object({
    meta: z.object({
      current: z.number(),
      limit: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
    result: z.array(TableItem),
  }),
  message: z.string(),
});

export type TableListItemsResType = z.TypeOf<typeof TableListItemsRes>;

export const TableItemsCreate = z.object({
  restaurant_id: z.string().optional(),
  token: z.string().optional(),
  capacity: positiveIntegerSchema,
  table_number: positiveIntegerSchema,
  status: z.string(),
});

export type TableItemsCreateType = z.TypeOf<typeof TableItemsCreate>;

export const TableItemsUpdate = z.object({
  tableId:z.string().optional(),
  restaurant_id: z.string().optional(),
  token: z.string().optional(),
  capacity: positiveIntegerSchema,
  table_number: positiveIntegerSchema,
  status: z.string(),
});

export type TableItemsUdpateType = z.TypeOf<typeof TableItemsUpdate>;

//=====================is not use=========================================

export const CreateTableBody = z.object({
  number: z.coerce.number().positive(),
  capacity: z.coerce.number().positive(),
  status: z.enum(TableStatusValues).optional(),
});

export type CreateTableBodyType = z.TypeOf<typeof CreateTableBody>;

export const TableSchema = z.object({
  number: z.coerce.number(),
  capacity: z.coerce.number(),
  status: z.enum(TableStatusValues),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TableRes = z.object({
  data: TableSchema,
  message: z.string(),
});

export type TableResType = z.TypeOf<typeof TableRes>;

export const TableListRes = z.object({
  data: z.array(TableSchema),
  message: z.string(),
});

export type TableListResType = z.TypeOf<typeof TableListRes>;

export const UpdateTableBody = z.object({
  changeToken: z.boolean(),
  capacity: z.coerce.number().positive(),
  status: z.enum(TableStatusValues).optional(),
});
export type UpdateTableBodyType = z.TypeOf<typeof UpdateTableBody>;
export const TableParams = z.object({
  number: z.coerce.number(),
});
export type TableParamsType = z.TypeOf<typeof TableParams>;
