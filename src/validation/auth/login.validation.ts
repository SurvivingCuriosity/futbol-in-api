import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string("El campo 'contraseña' es requerido.").min(6, "La contraseña debe tener al menos 6 caracteres")
});
export type LoginBody = z.infer<typeof loginSchema>;
