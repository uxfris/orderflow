import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(255),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
});

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().trim().default(""),
  sortBy: z.enum(["name", "price", "stock", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;

export type GetProductsQueryDTO = z.infer<typeof getProductsQuerySchema>;
