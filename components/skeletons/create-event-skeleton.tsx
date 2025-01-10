// components/skeletons/create-event-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function CreateEventFormSkeleton() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Title Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" /> {/* Label */}
        <Skeleton className="h-10 w-full" /> {/* Input */}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" /> {/* Label */}
        <Skeleton className="h-32 w-full" /> {/* Textarea */}
      </div>

      {/* Location Field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" /> {/* Label */}
        <Skeleton className="h-10 w-full" /> {/* Input */}
      </div>

      {/* Date/Time Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Time */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
          <Skeleton className="h-3 w-48" /> {/* Description */}
        </div>

        {/* End Time */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
          <Skeleton className="h-3 w-48" /> {/* Description */}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <Skeleton className="h-10 w-20" /> {/* Cancel button */}
        <Skeleton className="h-10 w-28" /> {/* Create button */}
      </div>
    </div>
  );
}
