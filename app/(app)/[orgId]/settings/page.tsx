// app/[orgId]/settings/page.tsx
import { BillingTab } from "@/components/settings/billing-tab";
import { DangerZone } from "@/components/settings/danger-zone";
import { GeneralTab } from "@/components/settings/general-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrganizationData } from "@/lib/actions/organization";
import { Suspense } from "react";

interface PageProps {
  params: {
    orgId: string;
  };
}

export default async function SettingsPage({ params }: PageProps) {
  const { orgId } = await params;
  const { organization } = await getOrganizationData(orgId);

  return (
    <main className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Organization Settings
        </h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Suspense fallback={<div>Loading general settings...</div>}>
            <GeneralTab organization={organization} />
          </Suspense>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Suspense fallback={<div>Loading billing settings...</div>}>
            <BillingTab orgId={orgId} />
          </Suspense>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="rounded-lg border p-4">
            <Suspense fallback={<div>Loading team settings...</div>}>
              <h2 className="text-lg font-semibold mb-4">Team Management</h2>
              {/* Team management implementation */}
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4" id="security">
          <div className="rounded-lg border p-4">
            <Suspense fallback={<div>Loading security settings...</div>}>
              <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
              {/* Security settings implementation */}
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>

      <DangerZone orgId={orgId} />
    </main>
  );
}
