import { z } from "zod";

export const editGuestSchema = z.object({
  title: z
    .string()
    .optional()
    .transform((val) => val || null),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .email("Invalid email")
    .optional()
    .transform((val) => val || null),
  phoneNumber: z
    .string()
    .optional()
    .transform((val) => val || null),
  role: z
    .string()
    .optional()
    .transform((val) => val || null),
});

export type EditGuestSchema = z.infer<typeof editGuestSchema>;
