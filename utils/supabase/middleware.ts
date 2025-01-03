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
  console.log("🚀 Middleware Starting...");
  console.log("📍 Current Path:", request.nextUrl.pathname);

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
  console.log("📂 Path Segments:", pathSegments);

  // Check if it's a public route
  const isPublicRoute = PUBLIC_ROUTES.includes(path) || path.startsWith("/e/");
  console.log("🔓 Is Public Route:", isPublicRoute);

  if (isPublicRoute) {
    console.log("↩️ Returning for public route");
    return response;
  }

  // Get authenticated user with validated metadata
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.log("❌ No authenticated user found or error:", userError);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  console.log("👤 User authenticated:", user.id);
  console.log(
    "🔐 Current user metadata:",
    JSON.stringify(user.user_metadata, null, 2)
  );

  // Handle empty path or root path
  if (pathSegments.length === 0 || path === "/") {
    console.log("🏠 Handling root path...");

    // First try to get the current org from metadata
    const currentOrgId = user.user_metadata?.navigation?.currentOrgId;
    const currentEventId = user.user_metadata?.navigation?.currentEventId;

    console.log(
      "📌 From metadata - currentOrgId:",
      currentOrgId,
      "currentEventId:",
      currentEventId
    );

    if (currentOrgId) {
      console.log("✅ Found currentOrgId in metadata");
      // If we have both org and event IDs, redirect to the event page
      if (currentEventId) {
        console.log(
          "➡️ Redirecting to event page:",
          `/${currentOrgId}/events/${currentEventId}`
        );
        return NextResponse.redirect(
          new URL(`/${currentOrgId}/events/${currentEventId}`, request.url)
        );
      }
      // Otherwise, redirect to the org dashboard
      console.log("➡️ Redirecting to org dashboard:", `/${currentOrgId}`);
      return NextResponse.redirect(new URL(`/${currentOrgId}`, request.url));
    }

    console.log("🔍 No currentOrgId in metadata, checking database...");
    // If no currentOrgId in metadata, try to get user's organization
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("orgId")
      .eq("id", user.id)
      .single();

    console.log("📊 Database user data:", userData);
    if (userError) console.log("❌ Database error:", userError);

    if (userData?.orgId) {
      console.log("✅ Found orgId in database:", userData.orgId);
      // Update the navigation metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          navigation: {
            currentOrgId: userData.orgId.toString(),
            currentEventId: undefined,
          },
        },
      });

      if (updateError) {
        console.log("❌ Error updating metadata:", updateError);
      } else {
        console.log("✅ Updated metadata successfully");
      }

      console.log("➡️ Redirecting to org dashboard:", `/${userData.orgId}`);
      return NextResponse.redirect(new URL(`/${userData.orgId}`, request.url));
    }

    console.log("➡️ No organization found, redirecting to create-org");
    return NextResponse.redirect(new URL("/create-org", request.url));
  }

  // Check if this is an organization-scoped route
  if (pathSegments.length >= 1) {
    const orgId = pathSegments[0];
    console.log("🏢 Checking organization route:", orgId);

    // If first segment is not a number, it's not an org route
    if (isNaN(Number(orgId))) {
      console.log("❌ Not a valid org route (not a number)");
      return response;
    }

    // Validate that the organization exists
    const { data: orgExists, error: orgError } = await supabase
      .from("Organization")
      .select("id")
      .eq("id", orgId)
      .single();

    if (orgError || !orgExists) {
      console.log("❌ Organization does not exist:", orgId);
      // Redirect to their current org if they have one
      if (user.user_metadata?.navigation?.currentOrgId) {
        console.log(
          "↩️ Redirecting to current org:",
          user.user_metadata.navigation.currentOrgId
        );
        return NextResponse.redirect(
          new URL(`/${user.user_metadata.navigation.currentOrgId}`, request.url)
        );
      }
      return NextResponse.redirect(new URL("/create-org", request.url));
    }

    // Get user's membership in the organization
    const { data: memberData, error: memberError } = await supabase
      .from("OrganizationMember")
      .select("role")
      .match({ userId: user.id, orgId })
      .single();

    // Get a fresh user object with validated metadata
    const {
      data: { user: validatedUser },
      error: refreshError,
    } = await supabase.auth.getUser();

    console.log("🔄 Checking if org switch needed...");
    // If user has access to this org but it's different from their current org, update metadata
    if (
      memberData &&
      orgId !== validatedUser?.user_metadata?.navigation?.currentOrgId
    ) {
      console.log(
        "🔄 Updating currentOrgId in metadata from",
        validatedUser?.user_metadata?.navigation?.currentOrgId,
        "to",
        orgId
      );
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          navigation: {
            currentOrgId: orgId,
            // Clear eventId when switching orgs
            currentEventId: undefined,
          },
        },
      });
      if (updateError) {
        console.log("❌ Error updating org metadata:", updateError);
      } else {
        console.log("✅ Successfully updated org metadata");

        // Verify the update by getting fresh user data
        const {
          data: { user: updatedUser },
        } = await supabase.auth.getUser();
        console.log(
          "✅ Verified new metadata:",
          JSON.stringify(updatedUser?.user_metadata, null, 2)
        );

        // Force a redirect to the new org to ensure the session is refreshed
        console.log("🔄 Forcing redirect to refresh session for org:", orgId);
        return NextResponse.redirect(new URL(`/${orgId}`, request.url));
      }
    }

    console.log("👥 Member data:", memberData);
    if (memberError) console.log("❌ Member lookup error:", memberError);

    // If user is not a member of this organization
    if (!memberData) {
      console.log("❌ User is not a member of this organization");
      // Get user's organization
      const { data: userData } = await supabase
        .from("User")
        .select("orgId")
        .eq("id", user.id)
        .single();

      console.log("🔄 Falling back to user data:", userData);

      // Update user metadata to clear the current org if they're not a member
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          navigation: {
            currentOrgId: userData?.orgId?.toString(),
            currentEventId: undefined,
          },
        },
      });

      if (updateError) {
        console.log("❌ Error updating metadata:", updateError);
      }

      return userData?.orgId
        ? NextResponse.redirect(new URL(`/${userData.orgId}`, request.url))
        : NextResponse.redirect(new URL("/create-org", request.url));
    }

    const role = memberData.role as OrgRole;
    const remainingPath = `/${pathSegments.slice(1).join("/")}`;
    console.log("🛣️ Remaining path:", remainingPath);
    console.log("👑 User role:", role);

    // Handle event routes and update metadata
    if (pathSegments[1] === "events" && pathSegments[2]) {
      const eventId = pathSegments[2];
      console.log("🎯 Updating event metadata:", eventId);

      // Update the currentEventId in metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          navigation: {
            currentEventId: eventId,
            currentOrgId: orgId,
          },
        },
      });

      if (updateError) {
        console.log("❌ Error updating event metadata:", updateError);
      } else {
        console.log("✅ Updated event metadata successfully");
      }
    }

    // Check owner routes
    const isOwnerRoute = PROTECTED_ROUTES.owner.routes.some((route) =>
      remainingPath.startsWith(route)
    );
    if (isOwnerRoute && !PROTECTED_ROUTES.owner.allowedRoles.includes(role)) {
      console.log("🚫 Unauthorized access to owner route");
      return NextResponse.redirect(
        new URL(`/unauthorized?orgId=${orgId}`, request.url)
      );
    }

    // Check admin routes
    const isAdminRoute = PROTECTED_ROUTES.admin.routes.some((route) =>
      remainingPath.startsWith(route)
    );
    if (isAdminRoute && !PROTECTED_ROUTES.admin.allowedRoles.includes(role)) {
      console.log("🚫 Unauthorized access to admin route");
      return NextResponse.redirect(
        new URL(`/unauthorized?orgId=${orgId}`, request.url)
      );
    }
  }

  console.log("✅ Middleware completed successfully");
  return response;
};
