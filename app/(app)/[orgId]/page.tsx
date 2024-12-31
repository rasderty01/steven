// app/[orgId]/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Calendar, Users } from "lucide-react";
import { Suspense } from "react";

import { ActivityFeed } from "@/components/organization/activity-feed";
import { QuickActions } from "@/components/organization/quick-actionts";
import { getOrganizationData } from "@/lib/actions/organization";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    orgId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { orgId } = await params;

  try {
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

        <Suspense fallback={<div>Loading stats...</div>}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.memberCount}</div>
                <p className="text-xs text-muted-foreground">
                  Active organization members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Events
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.activeEventsCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently running events
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Event Limit
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {organization.event_limit}
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum allowed events
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Guest Limit
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {organization.guest_limit_per_event}
                </div>
                <p className="text-xs text-muted-foreground">
                  Guests per event limit
                </p>
              </CardContent>
            </Card>
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
  } catch (error) {
    console.error("Error loading organization:", error);
    notFound();
  }
}

export const metadata = {
  title: "Organization Dashboard",
  description: "Overview of your organization",
};
