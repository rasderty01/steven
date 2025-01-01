import { Database } from "@/utils/supabase/database.types";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

type OrgRole = Database["public"]["Enums"]["OrgRole"];

// Define protected routes and required roles
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
];

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
          return request.cookies.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            request.cookies.set(cookie.name, cookie.value);
            response.cookies.set(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    }
  );

  const path = request.nextUrl.pathname;
  const pathSegments = path.split("/").filter(Boolean);

  // Check if it's a public route
  const isPublicRoute = PUBLIC_ROUTES.includes(path) || path.startsWith("/e/");
  if (isPublicRoute) {
    return response;
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Check if this is an organization-scoped route
  if (pathSegments.length >= 1) {
    const orgId = pathSegments[0];

    // If first segment is not a number, it's not an org route
    if (isNaN(Number(orgId))) {
      return response;
    }

    // Get user's membership in the organization
    const { data: memberData } = await supabase
      .from("OrganizationMember")
      .select("role")
      .match({ userId: user.id, orgId })
      .single();

    // If user is not a member of this organization
    if (!memberData) {
      // Get user's organization
      const { data: userData } = await supabase
        .from("User")
        .select("orgId")
        .eq("id", user.id)
        .single();

      return userData?.orgId
        ? NextResponse.redirect(new URL(`/${userData.orgId}`, request.url))
        : NextResponse.redirect(new URL("/create-org", request.url));
    }

    const role = memberData.role as OrgRole;
    const remainingPath = `/${pathSegments.slice(1).join("/")}`;

    // Check owner routes
    const isOwnerRoute = PROTECTED_ROUTES.owner.routes.some((route) =>
      remainingPath.startsWith(route)
    );
    if (isOwnerRoute && !PROTECTED_ROUTES.owner.allowedRoles.includes(role)) {
      return NextResponse.redirect(
        new URL(`/unauthorized?orgId=${orgId}`, request.url)
      );
    }

    // Check admin routes with updated redirect
    const isAdminRoute = PROTECTED_ROUTES.admin.routes.some((route) =>
      remainingPath.startsWith(route)
    );
    if (isAdminRoute && !PROTECTED_ROUTES.admin.allowedRoles.includes(role)) {
      return NextResponse.redirect(
        new URL(`/unauthorized?orgId=${orgId}`, request.url)
      );
    }
  }

  return response;
};
