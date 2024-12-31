// types/event.ts
import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  isVirtual: z.boolean().default(false),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
