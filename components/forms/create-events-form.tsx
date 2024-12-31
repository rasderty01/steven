"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input";
import { Textarea } from "@/components/ui/textarea";
import { createEvent } from "@/lib/actions/events";
import { CreateEventFormData, createEventSchema } from "@/types/events";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateEventFormProps {
  orgId: string;
}

export function CreateEventForm({ orgId }: CreateEventFormProps) {
  const router = useRouter();
  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      isVirtual: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateEventFormData) => createEvent({ ...data, orgId }),
    onSuccess: (result) => {
      if (!result.success) throw new Error(result.error);
      toast.success("Event created successfully!");
      router.push(`/${orgId}/events/${result.data?.id}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create event"
      );
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-8 max-w-2xl mx-auto"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your event"
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <SmartDatetimeInput
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="e.g. Tomorrow at 9am"
                  />
                </FormControl>
                <FormDescription>When does the event start?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <SmartDatetimeInput
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="e.g. Tomorrow at 5pm"
                  />
                </FormControl>
                <FormDescription>When does the event end?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
