// app/[orgId]/settings/layout.tsx
import SidebarNav from "@/app/(app)/[orgId]/settings/_components/settings/sidebar-settings";
import { Separator } from "@/components/ui/separator";
import { settingsNavItems } from "@/config/settings-navigation";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: { orgId: string };
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const orgId = (await params).orgId;

  return (
    <div className="space-y-6 p-6 pb-16 w-full flex flex-col">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account and organization preferences.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 w-full">
        <aside className="w-full lg:w-1/5">
          <SidebarNav items={settingsNavItems} orgId={orgId} />
        </aside>
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
}
