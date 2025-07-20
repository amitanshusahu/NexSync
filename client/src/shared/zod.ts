import { z } from "zod";

export const loginInput = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export type LoginParams = z.infer<typeof loginInput>;