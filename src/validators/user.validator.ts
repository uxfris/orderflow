import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.email(),
  password: z.string().min(8),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
