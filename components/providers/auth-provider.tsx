// components/providers/AuthCleanupProvider.tsx
"use client";

import { useAuthCleanup } from "@/lib/hooks/useAuthCleanup";

export function AuthCleanupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthCleanup();

  return children;
}
