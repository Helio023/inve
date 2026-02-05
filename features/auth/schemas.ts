import { z } from "zod";

export const AccountTypeEnum = z.enum(["FREELANCER", "AGENCY"]);

export const RegisterSchema = z.object({
  email: z.string().email("Insira um email válido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string(),

  name: z.string().min(3, "O nome é obrigatório"),
  phone: z.string().min(9, "Insira um número válido (ex: 84123...)"),
  
  accountType: AccountTypeEnum,
  province: z.string().min(1, "Selecione a província"),
  district: z.string().min(1, "Selecione o distrito"),
  description: z.string().optional(),
  
  
  logoUrl: z.any().optional(), 
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;



export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export type LoginInput = z.infer<typeof LoginSchema>;


export const ForgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string(),
  token: z.string().min(1, "Token inválido"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;