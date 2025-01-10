import { CreateEventForm } from "@/components/forms/create-events-form";
import PageLoader from "@/components/loader";
import { CreateEventFormSkeleton } from "@/components/skeletons/create-event-skeleton";
import { checkRole } from "@/utils/auth";
import { Suspense } from "react";

interface PageProps {
  params: {
    orgId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { orgId } = await params;

  await checkRole(orgId, ["Owner", "Admin"]);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-6 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create New Event
          </h1>
        </div>

        <div className="grid gap-4">
          <Suspense fallback={<CreateEventFormSkeleton />}>
            <div className="rounded-lg p-4">
              <CreateEventForm orgId={orgId} />
            </div>
          </Suspense>
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: "Create Event",
  description: "Create a new event for your organization",
};
