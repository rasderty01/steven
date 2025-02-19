import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { checkRole } from "@/utils/auth";
import { type Database } from "@/utils/supabase/database.types";
import { createServer } from "@/utils/supabase/server";
import { GuestHeader } from "./_components/guest-header";

import { DataTable } from "./_components/guests/data-table";
import { columns } from "./_components/guests/columns";
import { getGuests } from "./actions";

type GuestsPageProps = {
  params: {
    orgId: string;
    eventId: string;
  };
};

export default async function GuestsPage({ params }: GuestsPageProps) {
  const { orgId, eventId } = await params;

  const guests = await getGuests(eventId);

  await checkRole(orgId, ["Admin", "Owner", "Member"]);

  return (
    <section className="flex items-center justify-center">
      <div className="w-full">
        <GuestHeader />
        <DataTable columns={columns} data={guests} />
      </div>
    </section>
  );
}
