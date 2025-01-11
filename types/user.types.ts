import { Database } from "@/utils/supabase/database.types";

export type UserProfile = {
  name: string;
  email: string;
  subscriptionStatus: Database["public"]["Enums"]["SubscriptionStatus"];
  avatar?: string;
};

// Table rows
export type UserRow = Database["public"]["Tables"]["User"]["Row"];
