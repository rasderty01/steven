// app/profile/page.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createServer } from "@/utils/supabase/server";
import ProfileSkeleton from "../_components/skeleton/profile-skeleton";
import { ProfileForm } from "../_components/client/profile-form";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const supabase = await createServer();

  // Get session
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/signin");
  }

  // Fetch user data
  const { data: userData, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !userData) {
    throw new Error("Failed to fetch user data");
  }

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileForm initialData={userData} />
    </Suspense>
  );
}
