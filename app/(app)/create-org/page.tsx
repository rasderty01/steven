// app/(app)/[orgId]/create/page.tsx

import { CreateOrgForm } from "@/components/organizations/create-org-form";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateOrganizationPage() {
  return (
    <>
      <PageHeader
        title="Create New Organization"
        breadcrumbs={[
          { label: "Organizations", href: "/" },
          { label: "Create", href: "#" },
        ]}
      />

      <main className="flex-1 space-y-4 p-4 md:p-6">
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
      </main>
    </>
  );
}
