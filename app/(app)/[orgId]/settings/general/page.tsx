import { GeneralTab } from "@/app/(app)/[orgId]/settings/_components/settings/general-tab";
import { Separator } from "@/components/ui/separator";
import { getOrganizationData } from "@/lib/actions/organization";
import { checkRole } from "@/utils/auth";
import { Suspense } from "react";
import { GeneralTabSkeleton } from "../_components/skeleton/general-tab-skeleton";
interface PageProps {
  params: {
    orgId: string;
  };
}
export default async function GeneralPage({ params }: PageProps) {
  const { orgId } = await params;
  const { organization } = await getOrganizationData(orgId);

  await checkRole(orgId, ["Owner"]);

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Organization Settings</h3>
      </div>
      <Separator />
      <Suspense fallback={<GeneralTabSkeleton />}>
        <GeneralTab orgId={orgId} organization={organization} />
      </Suspense>
    </div>
  );
}
