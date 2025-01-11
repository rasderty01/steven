import { Database } from "@/utils/supabase/database.types";
import { SeatingPlanRow } from ".";

//enums
export type EventStatus = Database["public"]["Enums"]["EventStatus"];

//tables
export type EventRow = Database["public"]["Tables"]["Event"]["Row"];

//joined tables
export type EventWithSeatingPlan = EventRow & {
  SeatingPlan: Pick<SeatingPlanRow, "id" | "seating_plan_name"> | null;
};

export type EventPermissions = Database["public"]["Enums"]["EventPermissions"];
