"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createOrganization } from "@/lib/actions/organization";
import { CreateOrgFormData, createOrgSchema } from "@/types/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateOrgForm() {
  const router = useRouter();

  const form = useForm<CreateOrgFormData>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: (result) => {
      if (!result.success) {
        throw new Error(result.error);
      }
      toast.success("Organization created successfully!");
      router.push(`/${result.data?.id}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create organization"
      );
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter organization name" {...field} />
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
                  placeholder="Describe your organization"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            {mutation.isPending ? "Creating..." : "Create Organization"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
