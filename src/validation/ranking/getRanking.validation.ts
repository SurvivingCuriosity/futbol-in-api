import { z } from "zod";

export const rankingQuerySchema = z.object({
  limit: z
    .string()
    .transform((v) => Number(v))
    .refine((n) => !Number.isNaN(n) && n > 0, "limit debe ser un número > 0")
    .optional(),
});

export type RankingQuery = z.infer<typeof rankingQuerySchema>;
