// lib/query-keys.ts

export const queryKeys = {
  user: {
    profile: ["user"] as const,
    permissions: ["user-permissions"] as const,
  },
  organization: {
    list: ["organizations"] as const,
    details: (orgId: string) => ["organization", orgId] as const,
    members: (orgId: string) => ["organization", orgId, "members"] as const,
  },
  events: {
    all: ["events"] as const,
    byOrg: (orgId: string) => ["events", orgId] as const,
    detail: (eventId: string) => ["events", "detail", eventId] as const,
    guests: (eventId: string) => ["events", eventId, "guests"] as const,
  },
} as const;
