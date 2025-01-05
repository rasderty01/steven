// middleware.ts
import { Database } from "@/utils/supabase/database.types";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

type OrgRole = Database["public"]["Enums"]["OrgRole"];

const PROTECTED_ROUTES = {
  owner: {
    routes: ["/settings/general"],
    allowedRoles: ["Owner"] as OrgRole[],
  },
  admin: {
    routes: ["/events/create", "/settings/teams", "/settings/billing"],
    allowedRoles: ["Owner", "Admin"] as OrgRole[],
  },
} as const;

const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/unauthorized",
  "/create-org",
];

// Only get essential cookies for auth
const getAuthCookies = (cookies: NextRequest["cookies"]) => {
  return cookies
    .getAll()
    .filter((cookie) => {
      // Only include the latest auth token and refresh token
      const isAuthToken =
        cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token");
      const isRefreshToken =
        cookie.name.startsWith("sb-") && cookie.name.includes("-refresh-token");
      return isAuthToken || isRefreshToken;
    })
    .map((cookie) => ({
      name: cookie.name,
      value: cookie.value,
    }));
};

export const updateSession = async (request: NextRequest) => {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return getAuthCookies(request.cookies);
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            // Clean up old cookies with the same name
            if (cookie.name.includes("-auth-token")) {
              const baseName = cookie.name.split(".")[0];
              request.cookies
                .getAll()
                .filter((c) => c.name.startsWith(baseName))
                .forEach((oldCookie) => {
                  response.cookies.delete(oldCookie.name);
                });
            }

            // Set the new cookie
            response.cookies.set({
              name: cookie.name,
              value: cookie.value,
              ...cookie.options,
              // Set reasonable max age
              maxAge: 60 * 60 * 24 * 7, // 1 week
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
            });
          });
        },
      },
    }
  );

  const path = request.nextUrl.pathname;
  const pathSegments = path.split("/").filter(Boolean);

  // Check if it's a public route
  const isPublicRoute = PUBLIC_ROUTES.includes(path) || path.startsWith("/e/");
  if (isPublicRoute) return response;

  // Get authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Check if this is an organization-scoped route
  if (pathSegments.length >= 1) {
    const orgId = pathSegments[0];
    if (isNaN(Number(orgId))) return response;

    // Use single query to validate org and membership
    const { data: orgMember, error: orgError } = await supabase
      .from("OrganizationMember")
      .select(
        `
        role,
        organization:Organization (id)
      `
      )
      .eq("userId", user.id)
      .eq("orgId", orgId)
      .single();

    if (orgError || !orgMember?.organization) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    const role = orgMember.role as OrgRole;

    // Handle event routes more efficiently
    if (pathSegments[1] === "events" && pathSegments[2]) {
      const eventId = pathSegments[2];
      const { count } = await supabase
        .from("Event")
        .select("id", { count: "exact", head: true })
        .eq("id", eventId)
        .eq("orgId", orgId);

      if (!count) {
        return NextResponse.redirect(new URL(`/${orgId}`, request.url));
      }
    }

    const remainingPath = `/${pathSegments.slice(1).join("/")}`;

    // Check route permissions
    const isOwnerRoute = PROTECTED_ROUTES.owner.routes.some((route) =>
      remainingPath.startsWith(route)
    );
    const isAdminRoute = PROTECTED_ROUTES.admin.routes.some((route) =>
      remainingPath.startsWith(route)
    );

    if (
      (isOwnerRoute && !PROTECTED_ROUTES.owner.allowedRoles.includes(role)) ||
      (isAdminRoute && !PROTECTED_ROUTES.admin.allowedRoles.includes(role))
    ) {
      return NextResponse.redirect(
        new URL(`/unauthorized?orgId=${orgId}`, request.url)
      );
    }
  }

  return response;
};
