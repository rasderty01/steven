"use client";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function GeneralTabSkeleton() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Organization Settings</h3>
      </div>
      <Separator />

      <div className="rounded-lg p-4">
        <div className="space-y-4">
          <div className="grid gap-4">
            {/* Organization Name Section */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" /> {/* Label skeleton */}
              <Skeleton className="h-10 w-full" /> {/* Input skeleton */}
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" /> {/* Label skeleton */}
              <Skeleton className="h-[120px] w-full" />{" "}
              {/* Textarea skeleton */}
            </div>

            {/* Button Section */}
            <div className="flex justify-end">
              <Skeleton className="h-10 w-28" /> {/* Button skeleton */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
