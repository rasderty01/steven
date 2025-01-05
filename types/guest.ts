import { Database } from "@/utils/supabase/database.types";

type Guest = Database["public"]["Tables"]["Guest"]["Row"];
type RSVPStatus = Database["public"]["Enums"]["RSVPStatus"];

export type GuestWithRSVP = Guest & {
  RSVP: {
    attending: RSVPStatus | null;
    dietaryPreferences: string | null;
    plusOne: boolean | null;
  } | null;
};
