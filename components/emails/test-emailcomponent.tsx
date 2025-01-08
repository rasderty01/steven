import { useState } from "react";
import { renderAsync } from "@react-email/components";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WeddingEmail } from "./templates/wedding-email";

const testData = {
  eventName: "Sarah & John's Wedding",
  eventDate: "June 15th, 2024",
  eventTime: "4:00 PM",
  location: "The Grand Hotel, New York",
  description:
    "Join us for an evening of celebration and joy as we begin our journey together.",
  recipientName: "Dear Guest",
  organizerName: "Sarah & John",
  rsvpLink: "https://example.com/rsvp",
};

export function TestEmailPreview() {
  const [open, setOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePreview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Generating wedding email preview with data:", testData);
      const emailHtml = await renderAsync(<WeddingEmail {...testData} />);
      console.log(
        "Generated HTML:",
        emailHtml.length > 100 ? emailHtml.substring(0, 100) + "..." : emailHtml
      );
      setPreviewHtml(emailHtml);
    } catch (err) {
      console.error("Error generating preview:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate preview"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (newOpen) {
          generatePreview();
        } else {
          setPreviewHtml("");
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Test Wedding Email Template</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Wedding Email Template Preview</DialogTitle>
          <DialogDescription>
            Previewing the wedding email template with test data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              {error ? (
                <div className="text-red-500 p-4 bg-red-50 rounded-md">
                  {error}
                </div>
              ) : isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : previewHtml ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  No preview available
                </div>
              )}
            </div>
          </Card>

          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">Test Data Used:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(testData, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
