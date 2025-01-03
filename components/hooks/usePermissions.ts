"use client";

import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/database.types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback } from "react";

type EventPermission = Database["public"]["Enums"]["EventPermissions"];
type OrgRole = Database["public"]["Enums"]["OrgRole"];

// Define the permissions structure
interface Permissions {
  eventPermissions: EventPermission[];
  systemPermissions: string[];
}

const supabase = createClient();

// Type guard to check if the permissions object has the correct structure
function isPermissions(obj: unknown): obj is Permissions {
  if (!obj || typeof obj !== "object") return false;

  return (
    "eventPermissions" in obj &&
    "systemPermissions" in obj &&
    Array.isArray((obj as Permissions).eventPermissions) &&
    Array.isArray((obj as Permissions).systemPermissions)
  );
}

export function usePermissions() {
  const { orgId } = useParams();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("User data:", user);
      console.log("User error:", userError);

      if (userError || !user) throw userError || new Error("No user found");

      const { data: memberData } = await supabase
        .from("OrganizationMember")
        .select("*")
        .eq("userId", user.id)
        .eq("orgId", orgId as string)
        .single();

      if (!memberData) return null;

      const { data: permissionsData } = await supabase
        .from("RolePermissions")
        .select("permissions")
        .eq("role", memberData.role)
        .single();

      // Safely type check and convert the permissions
      let permissions: Permissions | null = null;
      if (
        permissionsData?.permissions &&
        isPermissions(permissionsData.permissions)
      ) {
        permissions = permissionsData.permissions;
      }

      return {
        userId: user.id,
        role: memberData.role as OrgRole,
        orgId: memberData.orgId,
        permissions,
      };
    },
    staleTime: 1000 * 60 * 60, // 60 minutes
  });

  const hasEventPermission = useCallback(
    (permission: EventPermission) => {
      if (!userData?.permissions?.eventPermissions) return false;
      return userData.permissions.eventPermissions.includes(permission);
    },
    [userData?.permissions]
  );

  const hasAllEventPermissions = useCallback(
    (requiredPermissions: EventPermission[]) => {
      if (!userData?.permissions?.eventPermissions) return false;
      return requiredPermissions.every((permission) =>
        userData.permissions?.eventPermissions.includes(permission)
      );
    },
    [userData?.permissions]
  );

  const hasSystemPermission = useCallback(
    (permission: string) => {
      if (!userData?.permissions?.systemPermissions) return false;
      return userData.permissions.systemPermissions.includes(permission);
    },
    [userData?.permissions]
  );

  return {
    isLoading,
    role: userData?.role || null,
    orgId: userData?.orgId,
    hasEventPermission,
    hasAllEventPermissions,
    hasSystemPermission,
  };
}
