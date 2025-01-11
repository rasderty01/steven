// components/settings/queries.ts
import { OrganizationRow, Subscription } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/database.types";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient();

export const queryKeys = {
  subscription: (orgId: string) => ["subscription", orgId] as const,
  organization: {
    details: (orgId: string) => ["organization", orgId] as const,
  },
} as const;

export function useSubscriptionPlan(orgId: string) {
  return useQuery({
    queryKey: queryKeys.subscription(orgId),
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("User")
        .select("subscriptionStatus, subscription_type")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data as Subscription;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useOrganizationDetails(orgId: string) {
  return useQuery({
    queryKey: queryKeys.organization.details(orgId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Organization")
        .select("*")
        .eq("id", orgId)
        .single();

      if (error) throw error;
      return data as OrganizationRow;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Shared subscription plans data
export const subscriptionPlans = [
  {
    name: "Starter",
    price: "$0/month",
    features: [
      "1 event",
      "100 guests per event",
      "3 organization members",
      "Basic features",
    ],
  },
  {
    name: "StarterPlus",
    price: "$29/month",
    features: [
      "5 events",
      "300 guests per event",
      "10 organization members",
      "Additional features",
      "Email communications",
      "Basic budget tracking",
    ],
  },
  {
    name: "Pro",
    price: "$79/month",
    features: [
      "10 events",
      "500 guests per event",
      "25 organization members",
      "Advanced features",
      "Advanced analytics",
      "Vendor portal",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited events",
      "1000+ guests per event",
      "100+ organization members",
      "Premium features",
      "Custom integrations",
      "Dedicated support",
    ],
  },
] as const;
