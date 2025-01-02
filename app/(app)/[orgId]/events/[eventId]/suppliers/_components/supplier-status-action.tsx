"use client";
import { usePermissions } from "@/components/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Database } from "@/utils/supabase/database.types";
import { CheckCircle2, ChevronDown, Loader2, XCircle } from "lucide-react";

type SupplierStatus = Database["public"]["Enums"]["SupplierStatus"];

interface StatusActionsProps {
  currentStatus: SupplierStatus;
  supplierId: number;
  onUpdateStatus: (status: SupplierStatus) => void;
  isUpdating: boolean;
}

const statusConfig = {
  Pending: {
    color: "bg-yellow-100 text-yellow-800",
    icon: Loader2,
    actions: ["Confirmed", "Cancelled"] as SupplierStatus[],
  },
  Confirmed: {
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
    actions: ["Completed", "Cancelled"] as SupplierStatus[],
  },
  Cancelled: {
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    actions: ["Pending"] as SupplierStatus[],
  },
  Completed: {
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle2,
    actions: ["Completed"] as SupplierStatus[],
  },
};

export function SupplierStatusActions({
  currentStatus,
  supplierId,
  onUpdateStatus,
  isUpdating,
}: StatusActionsProps) {
  const { hasEventPermission } = usePermissions();
  const canUpdateStatus = hasEventPermission("MANAGE_LOGISTICS");
  const config = statusConfig[currentStatus];
  const StatusIcon = config.icon;

  if (!canUpdateStatus) {
    return (
      <div
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${config.color}`}
      >
        <StatusIcon className="w-4 h-4 mr-1" />
        {currentStatus}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isUpdating}>
        <Button variant="ghost" className={`${config.color} gap-2`}>
          <StatusIcon
            className={`w-4 h-4 ${isUpdating ? "animate-spin" : ""}`}
          />
          {currentStatus}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {config.actions.map((status) => (
          <DropdownMenuItem key={status} onClick={() => onUpdateStatus(status)}>
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
