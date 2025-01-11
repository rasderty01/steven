import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Static header */}
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
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Name Section */}
              <div className="space-y-2">
                <Label className="font-semibold">Name</Label>
                <Skeleton className="h-5 w-48" />
              </div>

              {/* Email Section */}
              <div className="space-y-2">
                <Label className="font-semibold">Email</Label>
                <Skeleton className="h-5 w-64" />
              </div>

              {/* Subscription Section */}
              <div className="space-y-2">
                <Label className="font-semibold">Subscription</Label>
                <Skeleton className="h-5 w-40" />
              </div>

              {/* Subscription End Date Section */}
              <div className="space-y-2">
                <Label>Subscription End Date</Label>
                <Skeleton className="h-5 w-32" />
              </div>
            </div>

            {/* Button Section */}
            <div className="flex justify-end">
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileSkeleton;
