"use client";

import { deleteSupplierService } from "@/app/(app)/[orgId]/suppliers/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Database } from "@/utils/supabase/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

type SupplierService = Pick<
  Database["public"]["Tables"]["SupplierService"]["Row"],
  "id" | "name"
>;

interface DeleteSupplierServiceProps {
  service: SupplierService;
}

export function DeleteSupplierService({ service }: DeleteSupplierServiceProps) {
  const queryClient = useQueryClient();
  const { orgId } = useParams() as { orgId: string };

  const { mutate: remove, isPending } = useMutation({
    mutationFn: async () => {
      const result = await deleteSupplierService(service.id, parseInt(orgId));
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Service removed successfully");
      queryClient.invalidateQueries({ queryKey: ["org-suppliers"] });
    },
    onError: (error) => {
      toast.error("Failed to remove service", {
        description: error.message,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="flex items-center gap-2 text-red-600"
        >
          <Trash2 className="h-4 w-4" /> Delete Service
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            service "{service.name}" from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => remove()}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Removing..." : "Remove Service"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
