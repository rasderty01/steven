import { Database } from "@/utils/supabase/database.types";

//enums
export type RSVPStatus = Database["public"]["Enums"]["RSVPStatus"];

//tables

export type RSVPRow = Database["public"]["Tables"]["RSVP"]["Row"];
