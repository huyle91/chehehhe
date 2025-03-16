import { z } from "zod";
export const DishesSchema = z.object({
   id:z.string(),
   nameFood:z.string(),
   quantity:z.number(),
   nameCustomer: z.string(),
   tableNumber: z.number(),
   foodDetail: z.string(),
   status:z.string()
})

export type DishesType = z.TypeOf<typeof DishesSchema>