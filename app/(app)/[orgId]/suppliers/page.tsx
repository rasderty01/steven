"use client";

import { usePermissions } from "@/components/hooks/usePermissions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import { LoadingState } from "@/components/states/LoadingState";
import { NoPermissionState } from "@/components/states/NoPermissionsState";
import { SuppliersList } from "./_components/SuppliersList";
import { AddSupplierForm } from "./_components/add-supplier-action";
import { Supplier } from "@/types";

const supabase = createClient();

export default function OrganizationSuppliersPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const [searchTerm, setSearchTerm] = useState("");

  const { hasSystemPermission, isLoading: permissionsLoading } =
    usePermissions();

  const { data: suppliers, isLoading: suppliersLoading } = useQuery({
    queryKey: ["org-suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Supplier")
        .select(
          `
          *,
          services:SupplierService (
            id,
            name,
            baseRate,
            rateType,
            description
          )
        `
        )
        .order("name")
        .returns<Supplier[]>();

      if (error) throw error;
      return data;
    },
    enabled: !permissionsLoading,
  });

  // Filter suppliers based on search term
  const filteredSuppliers = useMemo(() => {
    if (!suppliers) return [];
    if (!searchTerm.trim()) return suppliers;

    const normalizedSearch = searchTerm.toLowerCase().trim();
    return suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(normalizedSearch)
    );
  }, [suppliers, searchTerm]);

  if (permissionsLoading || suppliersLoading) {
    return <LoadingState />;
  }

  // Check if user has permission to manage suppliers
  if (!hasSystemPermission("member_management")) {
    return (
      <NoPermissionState
        title="No access to supplier management"
        description="You don't have permission to manage suppliers in this organization."
      />
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your organization's supplier list and their services
          </p>
        </div>
        <AddSupplierForm />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Suppliers</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="pending">Pending Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Suppliers</CardTitle>
              <CardDescription>
                Complete list of suppliers in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SuppliersList suppliers={filteredSuppliers} showServices />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified">
          <Card>
            <CardHeader>
              <CardTitle>Verified Suppliers</CardTitle>
              <CardDescription>
                Suppliers that have been verified by your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SuppliersList
                suppliers={filteredSuppliers.filter((s) => s.isVerified)}
                showServices
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verification</CardTitle>
              <CardDescription>Suppliers awaiting verification</CardDescription>
            </CardHeader>
            <CardContent>
              <SuppliersList
                suppliers={filteredSuppliers.filter((s) => !s.isVerified)}
                showServices
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
