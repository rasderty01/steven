// middleware.ts
import { OrgRole } from "@/types";
import { Database } from "@/utils/supabase/database.types";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = {
  owner: {
    routes: [
      "/settings/general",
      "/events/create",
      "/settings/teams",
      "/settings/billing",
    ],
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
  console.log(
    "🚀 Middleware Starting - Request URL:",
    request.nextUrl.pathname
  );

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
            if (cookie.name.includes("-auth-token")) {
              const baseName = cookie.name.split(".")[0];
              request.cookies
                .getAll()
                .filter((c) => c.name.startsWith(baseName))
                .forEach((oldCookie) => {
                  response.cookies.delete(oldCookie.name);
                });
            }
            response.cookies.set({
              name: cookie.name,
              value: cookie.value,
              ...cookie.options,
              maxAge: 60 * 60 * 24 * 7,
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
  console.log("📍 Path Segments:", pathSegments);

  // Check if it's a public route
  const isPublicRoute = PUBLIC_ROUTES.includes(path) || path.startsWith("/e/");
  console.log("🔓 Is Public Route:", isPublicRoute);
  if (isPublicRoute) return response;

  // Get authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log(
    "👤 User Auth Status:",
    user ? "Authenticated" : "Not Authenticated"
  );
  console.log("❌ User Error:", userError);

  if (userError || !user) {
    console.log("🚫 Redirecting to sign-in due to no user or error");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Check if this is an organization-scoped route
  if (pathSegments.length >= 1) {
    const orgId = pathSegments[0];
    console.log("🏢 Organization ID:", orgId);

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

    console.log("👥 Organization Member Data:", orgMember);
    console.log("❌ Organization Error:", orgError);

    if (orgError || !orgMember?.organization) {
      console.log("🚫 Redirecting to unauthorized - No org membership");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    const role = orgMember.role as OrgRole;
    console.log("👑 User Role:", role);

    // Handle event routes more efficiently
    if (pathSegments[1] === "events" && pathSegments[2]) {
      const eventId = pathSegments[2];
      console.log("📅 Event ID being accessed:", eventId);

      const { count } = await supabase
        .from("Event")
        .select("id", { count: "exact" })

        .eq("orgId", orgId);

      console.log("🔢 Event count found:", count);

      if (!count) {
        console.log("🚫 Redirecting - Event not found");
        return NextResponse.redirect(new URL(`/${orgId}`, request.url));
      }
    }

    const remainingPath = `/${pathSegments.slice(1).join("/")}`;
    console.log("🛣️ Remaining Path:", remainingPath);

    // Check route permissions
    const isOwnerRoute = PROTECTED_ROUTES.owner.routes.some((route) =>
      remainingPath.startsWith(route)
    );
    const isAdminRoute = PROTECTED_ROUTES.admin.routes.some((route) =>
      remainingPath.startsWith(route)
    );

    console.log("🔐 Route Checks:", {
      isOwnerRoute,
      isAdminRoute,
      userRole: role,
      ownerRoutesMatch: PROTECTED_ROUTES.owner.routes.filter((route) =>
        remainingPath.startsWith(route)
      ),
      adminRoutesMatch: PROTECTED_ROUTES.admin.routes.filter((route) =>
        remainingPath.startsWith(route)
      ),
    });

    if (
      (isOwnerRoute && !PROTECTED_ROUTES.owner.allowedRoles.includes(role)) ||
      (isAdminRoute && !PROTECTED_ROUTES.admin.allowedRoles.includes(role))
    ) {
      console.log("🚫 Redirecting to unauthorized - Insufficient permissions");
      return NextResponse.redirect(
        new URL(`/unauthorized?orgId=${orgId}`, request.url)
      );
    }
  }

  console.log("✅ Middleware completed successfully");
  return response;
};
