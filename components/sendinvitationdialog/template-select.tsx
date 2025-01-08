// app/components/SendInvitationsDialog/TemplateSelect.tsx
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { SendInvitationsFormData, Template } from "./types";

interface TemplateSelectProps {
  form: UseFormReturn<SendInvitationsFormData>;
  templates: Template[] | null;
}

export function TemplateSelect({ form, templates }: TemplateSelectProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="templateId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Template</FormLabel>
            <Select
              onValueChange={(value) => {
                const templateId = parseInt(value);
                field.onChange(templateId);

                const template = templates?.find((t) => t.id === templateId);
                if (template) {
                  form.setValue("templateType", template.type);
                }
              }}
              value={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {templates?.map((template) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Message (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Add a personal message..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
