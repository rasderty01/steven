// app/(app)/[orgId]/create/page.tsx

import { CreateOrgForm } from "@/components/forms/create-org-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateOrganizationPage() {
  return (
    <section className="flex-1 space-y-4 p-4 md:p-6">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Organization</CardTitle>
          <CardDescription>
            Add a new organization to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOrgForm />
        </CardContent>
      </Card>
    </section>
  );
}
