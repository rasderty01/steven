// app/components/SendInvitationsDialog/PreviewSection.tsx
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Guest, Template } from "./types";

interface PreviewSectionProps {
  previewHtml: string;
  isPreviewLoading: boolean;
  selectedTemplate: Template | undefined;
  selectedGuests: Guest[] | undefined;
}

export function PreviewSection({
  previewHtml,
  isPreviewLoading,
  selectedTemplate,
  selectedGuests,
}: PreviewSectionProps) {
  return (
    <ScrollArea className="h-[calc(90vh-200px)]">
      <div className="space-y-4">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">
                Selected Template: {selectedTemplate?.name}{" "}
                <span className="text-sm text-muted-foreground">
                  (Type: {selectedTemplate?.type})
                </span>
              </h3>
              <div className="mt-4 border rounded-lg p-4 bg-white">
                {isPreviewLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : !previewHtml ? (
                  <div className="text-muted-foreground text-center py-4">
                    No preview available. Please make sure your template is
                    correctly configured.
                  </div>
                ) : (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                )}
              </div>
            </div>
          </div>
        </Card>

        <div>
          <h3 className="font-semibold mb-2">
            Selected Guests ({selectedGuests?.length || 0}):
          </h3>
          <ScrollArea className="h-[100px] border rounded-md p-4">
            {selectedGuests?.map((guest) => (
              <div key={guest.id} className="py-1">
                {guest.firstName} {guest.lastName}{" "}
                {guest.email && `(${guest.email})`}
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </ScrollArea>
  );
}
