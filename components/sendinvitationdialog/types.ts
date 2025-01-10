// app/components/SendInvitationsDialog/types.ts
import { Database } from "@/utils/supabase/database.types";

export const templateTypes = ["general", "wedding", "birthday"] as const;
export type TemplateType = (typeof templateTypes)[number];

export interface Guest {
  id: number;
  firstName: string | null;
  lastName: string;
  email: string | null;
  RSVP: {
    attending: Database["public"]["Enums"]["RSVPStatus"];
  } | null;
}

export type Template = Database["public"]["Tables"]["EmailTemplate"]["Row"];

export interface SendInvitationsFormData {
  templateId: number;
  templateType: TemplateType;
  message?: string;
  selectedGuests: number[];
  consent: boolean; // Added consent field
}

// Add schema for form validation
import * as z from "zod";

export const sendInvitationsSchema = z.object({
  templateId: z.number(),
  templateType: z.enum(templateTypes),
  message: z.string().optional(),
  selectedGuests: z
    .array(z.number())
    .min(1, "Please select at least one guest"),
  consent: z.boolean(),
});

// Create separate schemas for each step
export const selectStepSchema = sendInvitationsSchema.pick({
  templateId: true,
  templateType: true,
  selectedGuests: true,
});

export const previewStepSchema = sendInvitationsSchema.pick({
  message: true,
});

export const confirmStepSchema = sendInvitationsSchema
  .pick({
    consent: true,
  })
  .extend({
    consent: z.boolean().refine((val) => val === true, {
      message: "You must agree to send emails to the selected guests",
    }),
  });

export type SendInvitationsForm = z.infer<typeof sendInvitationsSchema>;
