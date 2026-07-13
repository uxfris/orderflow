import { z } from "zod";

export const authSigninSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const authSignupSchema = authSigninSchema.extend({
  name: z.string().min(1).max(255),
});

export type AuthSigninDTO = z.infer<typeof authSigninSchema>;
export type AuthSignupDTO = z.infer<typeof authSignupSchema>;
