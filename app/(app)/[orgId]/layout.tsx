import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "./_components/app-header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { orgId: string };
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const orgId = (await params).orgId;
  return (
    <SidebarProvider>
      <AppSidebar orgId={orgId} />
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <AppHeader orgId={orgId} />
          <main className="flex-1 ">
            <div className="container py-6">{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
