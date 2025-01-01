import { Separator } from "@/components/ui/separator";
import { checkRole } from "@/utils/auth";
interface PageProps {
  params: {
    orgId: string;
  };
}
export default async function TeamsPage({ params }: PageProps) {
  const { orgId } = await params;

  await checkRole(orgId, ["Owner", "Admin"]);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Team Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage your team members and their roles.
        </p>
      </div>
      <Separator />
      {/* Team management component */}
    </div>
  );
}
