import z from "zod"
import { DishesSchema } from "./dishes.schema"


export const OrderCheffSchema = z.object({
    id:z.string(),
    customerName:z.string(),
    ofTable:z.number(),
    createAt:z.string(),
    listDishes:z.array(DishesSchema),
})

export type TypeOrderCheffSchema = z.TypeOf<typeof OrderCheffSchema>