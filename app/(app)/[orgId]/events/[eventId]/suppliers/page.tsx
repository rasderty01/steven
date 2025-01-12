import { createServer } from "@/utils/supabase/server";
import { SupplierManagementClient } from "./_components/supplier-management-client";
import { SupplierWithServices } from "@/types";

type SupplierPageProps = {
  params: {
    eventId: string;
  };
};

export default async function SuppliersPage({ params }: SupplierPageProps) {
  const supabase = await createServer();
  const { eventId } = await params;

  // Fetch suppliers with their services
  const { data: suppliers } = await supabase.from("Supplier").select(`
      *,
      services:SupplierService(*)
    `);

  // Filter out suppliers without services
  const suppliersWithServices =
    (suppliers?.filter(
      (supplier) => supplier.services && supplier.services.length > 0
    ) as SupplierWithServices[]) || [];

  // Fetch event suppliers
  const { data: eventSuppliers } = await supabase
    .from("EventSupplier")
    .select(
      `
      *,
      supplier:Supplier(*),
      service:SupplierService(*)
    `
    )
    .eq("eventId", Number(eventId));

  return (
    <SupplierManagementClient
      suppliers={suppliersWithServices}
      eventSuppliers={eventSuppliers || []}
      eventId={eventId}
    />
  );
}
