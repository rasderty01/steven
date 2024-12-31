import { GeneralTab } from "@/components/settings/general-tab";
import { Separator } from "@/components/ui/separator";
import { getOrganizationData } from "@/lib/actions/organization";
interface PageProps {
  params: {
    orgId: string;
  };
}
export default async function GeneralPage({ params }: PageProps) {
  const { orgId } = await params;
  const { organization } = await getOrganizationData(orgId);

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Organization Settings</h3>
      </div>
      <Separator />
      <GeneralTab organization={organization} />
    </div>
  );
}
