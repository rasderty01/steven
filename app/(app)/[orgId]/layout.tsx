import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { headers } from "next/headers";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { orgId: string };
}

function getBreadcrumbs(pathname: string, orgId: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [];

  // Add Home as first breadcrumb
  if (segments[1] === "events") {
    breadcrumbs.push({ label: "Home", href: `/${orgId}` });
    breadcrumbs.push({
      label: "Events",
      href: segments[2] ? `/${orgId}/events` : null,
    });

    if (segments[2] === "create") {
      breadcrumbs.push({ label: "Create New Event", href: null });
    } else if (segments[2]) {
      // Handle event subpages
      const subpages: { [key: string]: string } = {
        guests: "Guest Management",
        budget: "Budget & Expenses",
        "seating-plan": "Seating Plan",
        logistics: "Logistics",
        rsvp: "RSVP Management",
        communications: "Communications",
        feedback: "Feedback",
        reports: "Reports",
      };

      breadcrumbs.push({
        label: "Event Details",
        href: `/${orgId}/events/${segments[2]}`,
      });
      if (segments[3] && subpages.hasOwnProperty(segments[3])) {
        breadcrumbs.push({ label: subpages[segments[3]], href: null });
      }
    }
  } else {
    breadcrumbs.push({ label: "Home", href: null });
  }

  return breadcrumbs;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const headersData = await headers();
  const pathname = headersData.get("x-pathname") ?? "";
  const orgId = (await params).orgId;
  const breadcrumbs = getBreadcrumbs(pathname, orgId);

  return (
    <SidebarProvider>
      <AppSidebar orgId={orgId} />
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 bg-background border-b">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <BreadcrumbItem key={index}>
                      {crumb.href ? (
                        <Link
                          href={crumb.href}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="font-medium">{crumb.label}</span>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="px-3">{/* <NavActions /> */}</div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="container max-w-6xl py-6">{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
