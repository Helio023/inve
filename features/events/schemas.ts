import { z } from "zod";

export const EventTypeEnum = z.enum(['wedding', 'birthday', 'corporate', 'baby_shower', 'other']);

// Schema para Criação
export const CreateEventSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3, "URL muito curta").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "URL inválida"),
  eventType: EventTypeEnum,
  date: z.date(),
});


export type CreateEventInput = z.infer<typeof CreateEventSchema>;


export const UpdateEventSchema = z.object({
  eventId: z.string(),
  title: z.string().min(3),
  date: z.date(),
  description: z.string().optional(),
  coverImage: z.string().optional(), 
});

export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;