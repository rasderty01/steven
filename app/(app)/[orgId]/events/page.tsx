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
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                  Project Management & Task Tracking
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4 md:p-6">
        <Suspense fallback={<div>Loading overview...</div>}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* <StatsCard title="Total Projects" value="12" />
            <StatsCard title="Active Tasks" value="48" />
            <StatsCard title="Team Members" value="8" />
            <StatsCard title="Completed" value="156" /> */}
          </div>
        </Suspense>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<div>Loading projects...</div>}>
            {/* <ProjectsOverview orgId={orgId} /> */}
          </Suspense>

          <Suspense fallback={<div>Loading tasks...</div>}>
            {/* <RecentTasks orgId={orgId} /> */}
          </Suspense>

          <Suspense fallback={<div>Loading activity...</div>}>
            {/* <ActivityFeed orgId={orgId} /> */}
          </Suspense>
        </div>
      </main>
    </>
  );
}
