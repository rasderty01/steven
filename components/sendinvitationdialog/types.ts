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
}
