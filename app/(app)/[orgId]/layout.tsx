// app/(dashboard)/layout.tsx
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { orgId: string }; // You'll get this from the route
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar orgId={await params.orgId} />
      {children}
    </SidebarProvider>
  );
}
