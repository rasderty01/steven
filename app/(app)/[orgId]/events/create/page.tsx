import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
              <BreadcrumbItem>Events</BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>Create New Event</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create New Event
          </h1>
        </div>

        <div className="grid gap-4">
          <Suspense fallback={<div>Loading form...</div>}>
            <div className="rounded-lg border p-4">
              {/* <CreateEventForm orgId={orgId} /> */}
            </div>
          </Suspense>
        </div>
      </main>
    </>
  );
}

export const metadata = {
  title: "Create Event",
  description: "Create a new event for your organization",
};
