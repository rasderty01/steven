// app/components/SendInvitationsDialog/index.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Mail, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Database } from "@/utils/supabase/database.types";
import { getEmailTemplate } from "@/components/emails/templates";
import { renderAsync } from "@react-email/components";

import React from "react";
import { TemplateSelect } from "@/components/sendinvitationdialog/template-select";
import { GuestSelect } from "@/components/sendinvitationdialog/guest-select";
import { PreviewSection } from "@/components/sendinvitationdialog/preview-section";
import { ConfirmSection } from "@/components/sendinvitationdialog/confirm-section";
import { Form } from "@/components/ui/form";
import { useSidebar } from "@/components/ui/sidebar";
import {
  SendInvitationsForm,
  sendInvitationsSchema,
  TemplateType,
} from "@/components/sendinvitationdialog/types";

const supabase = createClient();

export interface Guest {
  id: number;
  firstName: string | null;
  lastName: string;
  email: string | null;
  RSVP: {
    attending: Database["public"]["Enums"]["RSVPStatus"];
  } | null;
}

export function SendInvitationsDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"select" | "preview" | "confirm">("select");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const { orgId, eventId } = useParams();
  const { isMobile } = useSidebar();

  const form = useForm<SendInvitationsForm>({
    resolver: zodResolver(sendInvitationsSchema),
    defaultValues: {
      selectedGuests: [],
      message: "",
      templateType: "general",
      consent: false,
    },
  });

  const { data: eventData } = useQuery({
    queryKey: ["event"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Event")
        .select(
          `
        *,
        Organization!Event_orgId_fkey (
          name,
          description
        ),
        User (
          name
        )
      `
        )
        .eq("id", eventId as string)
        .single();

      if (error) throw error;
      return data;
    },
  });

  console.log(eventData, "eventData");

  const { data: templates } = useQuery({
    queryKey: ["email-templates", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("EmailTemplate")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const { data: guests, isLoading: isLoadingGuests } = useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Guest")
        .select("id, firstName, lastName, email, RSVP!inner(attending)")
        .eq("eventId", eventId as string)
        .eq("is_deleted", false);

      if (error) throw error;
      return data.map((guest) => ({
        ...guest,
        RSVP: guest.RSVP ? guest.RSVP[0] : null,
      })) as Guest[];
    },
  });

  const selectedTemplate = templates?.find(
    (template) => template.id === form.watch("templateId")
  );

  const selectedGuests = guests?.filter((guest) =>
    form.watch("selectedGuests")?.includes(guest.id)
  );

  const generatePreview = async () => {
    setIsPreviewLoading(true);
    try {
      const templateType = selectedTemplate?.type as TemplateType;
      if (!templateType) {
        throw new Error("No template type found in selected template");
      }

      const Template = getEmailTemplate(templateType);

      if (!Template) {
        throw new Error(`Template not found for type: ${templateType}`);
      }

      const baseUrl = window.location.origin;
      const eventDate = eventData?.startTime
        ? new Date(eventData.startTime).toLocaleDateString()
        : "TBA";
      const eventTime = eventData?.startTime
        ? new Date(eventData.startTime).toLocaleTimeString()
        : "TBA";

      console.log(eventData?.id);

      const emailProps = {
        eventName: eventData?.title || "Event Name",
        eventDate,
        eventTime,
        location: eventData?.location || "TBA",
        description: form.watch("message") || eventData?.description,
        recipientName: "Guest Name",
        organizerName: eventData?.User?.name || "Event Organizer",
        rsvpLink: `${baseUrl}/e/${eventData?.id}/rsvp`,
      };

      const emailHtml = await renderAsync(
        React.createElement(Template, emailProps)
      );
      setPreviewHtml(emailHtml);
    } catch (error) {
      console.error("Error generating preview:", error);
      toast.error("Failed to generate email preview");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Send invitations mutation
  const { mutate: sendInvitations, isPending } = useMutation({
    mutationFn: async (data: SendInvitationsForm) => {
      if (!selectedTemplate || !eventData || !selectedGuests) {
        throw new Error("Missing required data");
      }

      const Template = getEmailTemplate(selectedTemplate.type as TemplateType);
      const baseUrl = window.location.origin;
      const eventDate = new Date(eventData.startTime).toLocaleDateString();
      const eventTime = new Date(eventData.startTime).toLocaleTimeString();

      for (const guest of selectedGuests) {
        const emailProps = {
          eventName: eventData.title,
          eventDate,
          eventTime,
          location: eventData.location || "TBA",
          description: data.message || eventData.description,
          recipientName: `${guest.firstName} ${guest.lastName}`,
          organizerName: eventData.User?.name || "Event Organizer",
          rsvpLink: `${baseUrl}/e/${eventData.id}/rsvp/${guest.id}`,
        };

        const emailHtml = await renderAsync(
          React.createElement(Template, emailProps)
        );

        // Here you would send the email using your email service
        // await resend.emails.send({...})

        await supabase.from("RSVP").upsert({
          guestId: guest.id,
          eventId: parseInt(eventId as string),
          attending: "pending" as const,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          is_deleted: false,
        });
      }
    },
    onSuccess: () => {
      toast.success("Invitations sent successfully");
      setOpen(false);
      setStep("select");
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to send invitations");
      console.error("Error sending invitations:", error);
    },
  });

  const onSubmit = async (data: SendInvitationsForm) => {
    // Only validate consent when actually submitting
    const isConsentValid = await form.trigger("consent");
    if (!isConsentValid) {
      const consentError = form.formState.errors.consent?.message;
      if (consentError) {
        toast.error(consentError);
      }
      return;
    }

    if (data.selectedGuests.length === 0) {
      toast.error("Please select at least one guest");
      return;
    }
    sendInvitations(data);
  };

  const handleNext = async () => {
    let isValid = false;

    if (step === "select") {
      isValid = await form.trigger(["templateId", "selectedGuests"]);
      if (!isValid) {
        const errors = Object.entries(form.formState.errors);
        if (errors.length > 0) {
          toast.error(
            `Please check: ${errors.map(([field, error]) => error.message).join(", ")}`
          );
        }
        return;
      }
      setStep("preview");
      generatePreview();
    } else if (step === "preview") {
      // Preview step doesn't need validation since message is optional
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "preview") setStep("select");
    else if (step === "confirm") setStep("preview");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setStep("select");
          form.reset();
          setPreviewHtml("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size={isMobile ? "sm" : "default"} variant="default">
          <Mail className="w-4 h-4 mr-2" />
          Send Invitations
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {step === "select" && "Select Template and Guests"}
            {step === "preview" && "Preview Invitation"}
            {step === "confirm" && "Confirm and Send"}
          </DialogTitle>
          <DialogDescription>
            {step === "select" &&
              "Choose an email template and select guests to invite."}
            {step === "preview" && "Review how your invitation will look."}
            {step === "confirm" &&
              "Review and confirm your selections before sending."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === "select" && (
              <>
                <TemplateSelect form={form} templates={templates ?? []} />
                <GuestSelect
                  form={form}
                  guests={guests}
                  isLoadingGuests={isLoadingGuests}
                />
              </>
            )}

            {step === "preview" && (
              <PreviewSection
                previewHtml={previewHtml}
                isPreviewLoading={isPreviewLoading}
                selectedTemplate={selectedTemplate}
                selectedGuests={selectedGuests}
              />
            )}

            {step === "confirm" && (
              <ConfirmSection
                selectedTemplate={selectedTemplate}
                selectedGuests={selectedGuests}
                message={form.watch("message")}
                form={form}
              />
            )}

            <DialogFooter className="flex items-center justify-between sm:justify-between">
              {step !== "select" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="mr-auto"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setStep("select");
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                {step === "confirm" && (
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Sending..." : "Send Invitations"}
                  </Button>
                )}
                {step !== "confirm" && (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
