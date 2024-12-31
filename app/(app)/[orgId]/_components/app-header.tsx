"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";

interface AppHeaderProps {
  orgId: string;
}

function getBreadcrumbs(pathname: string, orgId: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [];

  // Base case - if we're on the org home page
  if (segments.length === 1) {
    return [{ label: "Home", href: null }];
  }

  // For events section
  if (segments[1] === "events") {
    // Start with Home
    breadcrumbs.push({ label: "Home", href: `/${orgId}` });

    // Add Events
    const isEventDetails = segments.length > 2;
    breadcrumbs.push({
      label: "Events",
      href: isEventDetails ? `/${orgId}/events` : null,
    });

    // If we have an event ID (viewing a specific event)
    if (segments[2] && segments[2] !== "create") {
      breadcrumbs.push({
        label: "Event Details",
        href: null,
      });

      // Add subpage if it exists
      if (segments[3]) {
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

        if (subpages[segments[3]]) {
          breadcrumbs.push({ label: subpages[segments[3]], href: null });
        }
      }
    }
    // Handle create new event page
    else if (segments[2] === "create") {
      breadcrumbs.push({ label: "Create New Event", href: null });
    }
  }
  // For any other section
  else {
    breadcrumbs.push({ label: "Home", href: `/${orgId}` });
    segments.slice(1).forEach((segment, index) => {
      const isLast = index === segments.length - 2;
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? null : `/${segments.slice(0, index + 2).join("/")}`,
      });
    });
  }

  return breadcrumbs;
}

export function AppHeader({ orgId }: AppHeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname, orgId);

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 bg-background border-b">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="px-3">{/* <NavActions /> */}</div>
    </header>
  );
}
