// utils/auth.ts
"use server";

import { Database } from "@/utils/supabase/database.types";
import { redirect } from "next/navigation";
import { createServer } from "./supabase/server";
import { OrgRole } from "@/types";

export async function checkRole(orgId: string, allowedRoles: OrgRole[]) {
  const supabase = await createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/sign-in");
  }

  // Check organization membership and role
  const { data: memberData, error: memberError } = await supabase
    .from("OrganizationMember")
    .select("role")
    .eq("userId", user.id)
    .eq("orgId", orgId)
    .single();

  if (memberError || !memberData) {
    redirect("/unauthorized");
  }

  if (!allowedRoles.includes(memberData.role)) {
    redirect("/unauthorized");
  }

  return {
    user,
    role: memberData.role,
  };
}

export async function isLoggedIn() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    // If authenticated, get user's organization
    const { data: userData } = await supabase
      .from("User")
      .select("orgId")
      .eq("id", session.user.id)
      .single();

    if (userData?.orgId) {
      redirect(`/${userData.orgId}`);
    } else {
      redirect("/create-org");
    }
  }
}
