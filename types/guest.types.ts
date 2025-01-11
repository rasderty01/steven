import { Database } from "@/utils/supabase/database.types";
import { RSVPRow, RSVPStatus } from ".";

//tables
export type GuestRow = Database["public"]["Tables"]["Guest"]["Row"];

//joined tables

//
export type GuestWithRSVP = GuestRow & {
  RSVP: Pick<RSVPRow, "attending" | "plusOne" | "dietaryPreferences"> | null;
};
