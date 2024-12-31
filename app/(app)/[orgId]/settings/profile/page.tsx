"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/database.types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type User = Database["public"]["Tables"]["User"]["Row"];

export default function ProfilePage() {
  const supabase = createClient();

  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Fetch user profile data
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("User")
        .update(updates)
        .eq("id", authUser.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error("Failed to update profile");
    },
  });

  // Enable editing mode
  const handleEdit = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email,
      });
      setIsEditing(true);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal account settings.
        </p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold">
                  Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-sm">{user?.name || "Not set"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">
                  Email
                </Label>
                <p className="text-sm">{user?.email}</p>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Subscription</Label>
                <p className="text-sm capitalize">
                  {user?.subscriptionStatus || "No active subscription"}
                </p>
              </div>

              {user?.subscription_end_date && (
                <div className="space-y-2">
                  <Label>Subscription End Date</Label>
                  <p className="text-sm">
                    {new Date(user.subscription_end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={handleEdit}>
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
