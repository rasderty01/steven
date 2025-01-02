import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

interface NoPermissionStateProps {
  title?: string;
  description?: string;
}

export function NoPermissionState({
  title = "Access Denied",
  description = "You don't have permission to access this resource.",
}: NoPermissionStateProps) {
  return (
    <Alert variant="destructive">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
