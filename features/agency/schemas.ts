import { z } from "zod";

export const UpdateAgencySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(9, "Telefone inválido"),
  emailContact: z.string().email("Email inválido"),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
  province: z.string().min(1, "Província obrigatória"),
  district: z.string().min(1, "Distrito obrigatório"),
});

export type UpdateAgencyInput = z.infer<typeof UpdateAgencySchema>;