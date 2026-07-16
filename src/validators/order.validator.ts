import { z } from "zod";

const itemsSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().int().positive(),
});
export const createOrderSchema = z.object({
  items: z.array(itemsSchema).nonempty(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export const cancelReasonSchema = z.object({
  reason: z.string().trim().min(1),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;

export type UpdateOrderStatusDTO = z.infer<typeof updateOrderStatusSchema>;

export type CancelReasonDTO = z.infer<typeof cancelReasonSchema>;
