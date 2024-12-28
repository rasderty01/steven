import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";

interface PageProps {
  params: {
    orgId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { orgId } = await params;

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>Organizations</BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

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
            <div className="rounded-lg border p-4">
              <Suspense fallback={<div>Loading general settings...</div>}>
                <h2 className="text-lg font-semibold mb-4">
                  General Information
                </h2>
                <form className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border p-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        className="w-full rounded-md border p-2"
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button className="rounded-md bg-primary px-4 py-2 text-sm text-white">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </Suspense>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="rounded-lg border p-4">
              <Suspense fallback={<div>Loading team settings...</div>}>
                <h2 className="text-lg font-semibold mb-4">Team Management</h2>
                {/* Team management components */}
              </Suspense>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <div className="rounded-lg border p-4">
              <Suspense fallback={<div>Loading billing settings...</div>}>
                <h2 className="text-lg font-semibold mb-4">Billing Settings</h2>
                {/* Billing components */}
              </Suspense>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="rounded-lg border p-4">
              <Suspense fallback={<div>Loading security settings...</div>}>
                <h2 className="text-lg font-semibold mb-4">
                  Security Settings
                </h2>
                {/* Security components */}
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>

        <div className="rounded-lg border border-destructive/50 p-4 mt-8">
          <h2 className="text-lg font-semibold text-destructive mb-4">
            Danger Zone
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete an organization, there is no going back. Please be
            certain.
          </p>
          <button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 text-sm">
            Delete Organization
          </button>
        </div>
      </main>
    </>
  );
}

export const metadata = {
  title: "Organization Settings",
  description: "Manage your organization settings",
};
