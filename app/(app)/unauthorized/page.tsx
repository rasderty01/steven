"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function UnauthorizedPage() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get("orgId");

  console.log(orgId);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center">
      <Alert variant="destructive" className="max-w-xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to access this page. Please contact your
          organization administrator if you believe this is a mistake.
        </AlertDescription>
      </Alert>

      {orgId ? (
        <Link
          href={`/${orgId}`}
          className={buttonVariants({
            variant: "default",
            size: "lg",
          })}
        >
          Return to Dashboard
        </Link>
      ) : (
        <Link
          href="/"
          className={buttonVariants({
            variant: "default",
            size: "lg",
          })}
        >
          Return to Home
        </Link>
      )}
    </div>
  );
}
