import { z } from "zod";

export const getFullUserQuerySchema = z.object({
  userId: z.string().min(1, "userId es obligatorio")
});
export type GetFullUserQuery = z.infer<typeof getFullUserQuerySchema>;
