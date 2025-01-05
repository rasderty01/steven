// hooks/useAuth.ts
"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const useAuthCleanup = () => {
  useEffect(() => {
    const cleanup = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        // Clean up old auth cookies
        document.cookie.split(";").forEach((cookie) => {
          const [name] = cookie.split("=");
          if (name.trim().startsWith("sb-")) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          }
        });
      }
    };
    cleanup();
  }, []);
};
