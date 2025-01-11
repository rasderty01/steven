import { Database } from "@/utils/supabase/database.types";

// Type based on database schema
export type OrganizationRow =
  Database["public"]["Tables"]["Organization"]["Row"];

// Type for updating an organization
export type OrganizationUpdate = Pick<OrganizationRow, "name" | "description">;

// enumss
export type OrgRole = Database["public"]["Enums"]["OrgRole"];

//subscription
export type Subscription = Pick<
  Database["public"]["Tables"]["User"]["Row"],
  "subscriptionStatus" | "subscription_type"
>;

//used in useOrganizations Hook
export type Team = {
  id: number;
  name: string;
  logo_url: string | null;
  plan: Database["public"]["Enums"]["SubscriptionStatus"];
};
