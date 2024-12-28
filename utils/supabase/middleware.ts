import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

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
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        },
        remove(name, options) {
          request.cookies.delete(name);
          response.cookies.delete(name);
        },
      },
    }
  );

  const path = request.nextUrl.pathname;
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Public routes
  const isPublicRoute =
    path === "/" ||
    path.startsWith("/e/") ||
    ["/sign-in", "/sign-up", "/forgot-password"].includes(path);

  if (isPublicRoute) {
    if (!user) return response;

    const { data: userData } = await supabase
      .from("User")
      .select("orgId")
      .eq("id", user.id)
      .single();

    return userData?.orgId
      ? NextResponse.redirect(new URL(`/${userData.orgId}`, request.url))
      : NextResponse.redirect(new URL("/create-org", request.url));
  }

  // Auth required routes
  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const { data: userData } = await supabase
    .from("User")
    .select("orgId")
    .eq("id", user.id)
    .single();

  if (!userData?.orgId && path !== "/create-org") {
    return NextResponse.redirect(new URL("/create-org", request.url));
  }

  // Organization access check
  const orgId = path.split("/")[3]; // /dashboard/organizations/[orgId]
  if (orgId && !isNaN(Number(orgId))) {
    const { data: memberData } = await supabase
      .from("OrganizationMember")
      .select("role")
      .match({ userId: user.id, orgId })
      .single();

    if (!memberData) {
      return userData?.orgId
        ? NextResponse.redirect(new URL(`/${userData.orgId}`, request.url))
        : NextResponse.redirect(new URL("/create-org", request.url));
    }
  }

  return response;
};
