import { z } from "zod";

const itemsSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().int().positive(),
});
export const createOrderSchema = z.object({
  items: z.array(itemsSchema),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
