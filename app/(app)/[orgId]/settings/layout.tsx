// app/[orgId]/settings/layout.tsx
import SidebarNav from "@/components/settings/sidebar-settings";
import { Separator } from "@/components/ui/separator";

const sidebarNavItems = [
  {
    title: "General",
    href: "/[orgId]/settings/general",
  },
  {
    title: "Profile",
    href: "/[orgId]/settings/profile",
  },
  {
    title: "Teams",
    href: "/[orgId]/settings/teams",
  },
  {
    title: "Billing",
    href: "/[orgId]/settings/billing",
  },
  {
    title: "Notifications",
    href: "/[orgId]/settings/notifications",
  },
];

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
        <aside className="">
          <SidebarNav items={sidebarNavItems} orgId={orgId} />
        </aside>
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
}
