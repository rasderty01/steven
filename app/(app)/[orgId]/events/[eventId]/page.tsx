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
    eventId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { orgId, eventId } = await params;

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
                <BreadcrumbPage>Event Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Event Details
          </h1>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium">
              Edit Event
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Suspense fallback={<div>Loading event details...</div>}>
            <section className="rounded-lg border p-4">
              <h2 className="text-lg font-semibold mb-4">Event Information</h2>
              <div className="space-y-4">
                {/* Event details component will go here */}
              </div>
            </section>
          </Suspense>

          <Suspense fallback={<div>Loading attendees...</div>}>
            <section className="rounded-lg border p-4">
              <h2 className="text-lg font-semibold mb-4">Attendees</h2>
              <div className="space-y-4">
                {/* Attendees list component will go here */}
              </div>
            </section>
          </Suspense>
        </div>
      </main>
    </>
  );
}

export const metadata = {
  title: "Event Details",
  description: "View and manage event details",
};
