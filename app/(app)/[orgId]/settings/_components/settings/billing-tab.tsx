"use client";

import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../../../../components/ui/button";
import { useSubscriptionPlan } from "./queries";

const subscriptionPlans = [
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
];

export function BillingTab({ orgId }: { orgId: string }) {
  const { data: subscription } = useSubscriptionPlan(orgId);

  const handleUpgrade = (plan: string) => {
    toast.info(`Upgrading to ${plan}. Implement payment flow here.`);
  };

  return (
    <div className="rounded-lg border p-4 w-full">
      <h2 className="text-lg font-semibold mb-4">Subscription Plans</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.name} className="p-6">
            <div className="space-y-4 h-full">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="text-3xl font-bold">{plan.price}</div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={
                  plan.name === subscription?.subscriptionStatus
                    ? "outline"
                    : "default"
                }
                onClick={() => handleUpgrade(plan.name)}
                disabled={plan.name === subscription?.subscriptionStatus}
              >
                {plan.name === subscription?.subscriptionStatus
                  ? "Current Plan"
                  : "Upgrade"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
