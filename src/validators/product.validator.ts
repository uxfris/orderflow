import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(255),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
});
export const updateProductSchema = createProductSchema.partial();

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
