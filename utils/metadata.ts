import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface NavigationMetadata {
  currentOrgId?: string;
  currentEventId?: string;
}

export async function updateUserMetadata(
  metadata: Partial<NavigationMetadata>
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error getting user:", userError);
    return null;
  }

  // Merge new metadata with existing metadata, preserving other fields
  const newMetadata = {
    ...user.user_metadata,
    navigation: {
      ...user.user_metadata?.navigation,
      ...metadata,
    },
  };

  console.log("Updating user metadata:", newMetadata);

  const { data, error } = await supabase.auth.updateUser({
    data: newMetadata,
  });

  if (error) {
    console.error("Error updating user metadata:", error);
    return null;
  }

  return data.user;
}

export async function getUserMetadata(): Promise<NavigationMetadata | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Error getting user metadata:", error);
    return null;
  }

  return {
    currentOrgId: user.user_metadata?.currentOrgId,
    currentEventId: user.user_metadata?.currentEventId,
  };
}
