import { z } from "zod/v4";

export const loginValidationSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginFormType = z.infer<typeof loginValidationSchema>;
