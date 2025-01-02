"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  ChevronRight,
  CreditCard,
  Layout,
  Mail,
  MoreHorizontal,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

type Event = {
  id: number;
  name: string;
  emoji: React.ReactNode;
};

interface NavEventsProps {
  events: Event[];
  onPageClick?: (pageName: string) => void;
}

const eventOptions = [
  { title: "Overview", url: "", icon: Layout },
  { title: "Reports", url: "/reports", icon: CreditCard },
  { title: "Suppliers", url: "/suppliers", icon: Truck },
  { title: "Guests", url: "/guests", icon: Users },
  { title: "Seat Plan", url: "/seatplan", icon: Layout },
  { title: "Event Page", url: "/eventpage", icon: Settings },
  { title: "RSVP", url: "/rsvp", icon: Mail },
];

export function NavEvents({ events, onPageClick }: NavEventsProps) {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const { orgId } = useParams();
  const pathname = usePathname();

  const getLimitedEvents = () => {
    return showAllEvents ? events : events.slice(0, 5);
  };

  const isEventOptionActive = (eventId: number, optionPath: string) => {
    return pathname === `/${orgId}/events/${eventId}${optionPath}`;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Events</SidebarGroupLabel>
      <SidebarMenu>
        {getLimitedEvents().map((event) => (
          <Collapsible
            key={event.id}
            asChild
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={event.name}>
                  {event.emoji}
                  <span>{event.name}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {eventOptions.map((option) => (
                    <SidebarMenuSubItem key={option.url}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isEventOptionActive(event.id, option.url)}
                      >
                        <Link
                          href={`/${orgId}/events/${event.id}${option.url}`}
                        >
                          <option.icon className="h-4 w-4" />
                          <span>{option.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
        {events.length > 5 && (
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setShowAllEvents(!showAllEvents)}
              tooltip={showAllEvents ? "Show less" : "Show more"}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span>{showAllEvents ? "Less" : "More"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default NavEvents;
