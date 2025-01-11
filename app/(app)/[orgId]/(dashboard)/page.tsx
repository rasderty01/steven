// app/[orgId]/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Calendar, Users, Users2 } from "lucide-react";
import { Suspense } from "react";

import { ActivityFeed } from "@/components/organization/activity-feed";
import { QuickActions } from "@/components/organization/quick-actionts";
import { getOrganizationData } from "@/lib/actions/organization";
import { notFound } from "next/navigation";
import { StatsCard } from "./_components/stats-card";

interface PageProps {
  params: {
    orgId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { orgId } = await params;
  const { organization, stats } = await getOrganizationData(orgId);

  if (!organization) {
    notFound();
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {organization.name} Dashboard
        </h1>
      </div>

      <Suspense fallback={<StatsLoadingSkeleton />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={Users}
            title="Total Members"
            value={stats.memberCount}
            description="Active organization members"
          />

          <StatsCard
            icon={Calendar}
            title="Active Events"
            value={stats.memberCount}
            description="Currently running events"
          />

          <StatsCard
            icon={AlertCircle}
            title="Event Limit"
            value={organization.event_limit}
            description="Maximum Allowed Events"
          />

          <StatsCard
            icon={Users2}
            title="Guest Limit"
            value={organization.guest_limit_per_event}
            description="Guests per event limit"
          />
        </div>
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Organization activity for the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading activity...</div>}>
              <ActivityFeed events={stats.recentEvents} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading actions...</div>}>
              <QuickActions orgId={orgId} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Organization Dashboard",
  description: "Overview of your organization",
};

function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="animate-pulse h-8 bg-gray-200 rounded" />
          <CardContent>
            <div className="animate-pulse h-6 bg-gray-200 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
