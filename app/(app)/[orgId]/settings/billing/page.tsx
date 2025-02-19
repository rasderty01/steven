import { BillingTab } from "@/app/(app)/[orgId]/settings/_components/settings/billing-tab";
import { Separator } from "@/components/ui/separator";

import { checkRole } from "@/utils/auth";

interface PageProps {
  params: {
    orgId: string;
  };
}
export default async function BillingPage({ params }: PageProps) {
  const { orgId } = await params;

  await checkRole(orgId, ["Owner"]);

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Organization Billing</h3>
        <p className="text-sm text-muted-foreground">
          Manage your organization's subscription and billing.
        </p>
      </div>
      <Separator />
      <BillingTab orgId={orgId} />
    </div>
  );
}
