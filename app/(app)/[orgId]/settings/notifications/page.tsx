"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Calendar, Loader2, Mail } from "lucide-react";

type NotificationPreferences = {
  emailNotifications: boolean;
  eventReminders: boolean;
  rsvpUpdates: boolean;
  guestListChanges: boolean;
  budgetAlerts: boolean;
};

const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailNotifications: true,
  eventReminders: true,
  rsvpUpdates: true,
  guestListChanges: true,
  budgetAlerts: true,
};

export default function NotificationsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Fetch user notification preferences from Supabase Auth metadata
  const { data: preferences, isLoading } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) throw new Error("Not authenticated");

      const userPreferences =
        user.user_metadata?.notificationPreferences || DEFAULT_PREFERENCES;
      return userPreferences as NotificationPreferences;
    },
  });

  // Update preferences mutation with optimistic updates
  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: NotificationPreferences) => {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          notificationPreferences: newPreferences,
        },
      });

      if (error) throw error;
      return data.user.user_metadata.notificationPreferences;
    },
    onMutate: async (newPreferences) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: ["notification-preferences"],
      });

      // Snapshot the previous value
      const previousPreferences =
        queryClient.getQueryData<NotificationPreferences>([
          "notification-preferences",
        ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["notification-preferences"], newPreferences);

      // Return a context object with the snapshotted value
      return { previousPreferences };
    },
    onError: (err, newPreferences, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(
        ["notification-preferences"],
        context?.previousPreferences
      );
      // toast.error("Failed to update notification preferences");
      console.error("Error updating preferences:", err);
    },
    onSuccess: () => {
      // toast.success(
      //   "Your notification preferences have been updated successfully."
      // );
    },
    // Always refetch after error or success to make sure our local data is correct
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
    },
  });

  const handleToggle = (key: keyof NotificationPreferences) => {
    if (!preferences) return;

    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    updatePreferences.mutate(newPreferences);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const NotificationItem = ({
    title,
    description,
    checked,
    onToggle,
    icon: Icon,
  }: {
    title: string;
    description: string;
    checked: boolean;
    onToggle: () => void;
    icon: any;
  }) => (
    <div className="flex items-start space-x-4 py-4">
      <div className="mt-1">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );

  if (!preferences) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications.
        </p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationItem
            title="Email Notifications"
            description="Receive notifications via email for important updates."
            checked={preferences.emailNotifications}
            onToggle={() => handleToggle("emailNotifications")}
            icon={Mail}
          />
          <Separator />
          <NotificationItem
            title="Event Reminders"
            description="Get reminded about upcoming events and important dates."
            checked={preferences.eventReminders}
            onToggle={() => handleToggle("eventReminders")}
            icon={Calendar}
          />
          <Separator />
          <NotificationItem
            title="RSVP Updates"
            description="Receive notifications when guests RSVP to your events."
            checked={preferences.rsvpUpdates}
            onToggle={() => handleToggle("rsvpUpdates")}
            icon={Bell}
          />
          <Separator />
          <NotificationItem
            title="Guest List Changes"
            description="Get notified about changes to your event guest lists."
            checked={preferences.guestListChanges}
            onToggle={() => handleToggle("guestListChanges")}
            icon={Bell}
          />
          <Separator />
          <NotificationItem
            title="Budget Alerts"
            description="Receive alerts about budget updates and thresholds."
            checked={preferences.budgetAlerts}
            onToggle={() => handleToggle("budgetAlerts")}
            icon={Bell}
          />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Note: Some notifications cannot be disabled as they contain important
        information about your account.
      </div>
    </div>
  );
}
