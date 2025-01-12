"use client";

import { removeSupplier } from "@/app/(app)/[orgId]/suppliers/actions";
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
import { Supplier } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export function RemoveSupplier({
  supplier,
  children,
}: {
  supplier: Supplier;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const { orgId } = useParams() as { orgId: string };
  const { mutate: remove, isPending } = useMutation({
    mutationFn: async () => {
      const result = await removeSupplier(supplier.id, parseInt(orgId));
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Supplier removed successfully");
      queryClient.invalidateQueries({ queryKey: ["org-suppliers"] });
    },
    onError: (error) => {
      toast.error("Failed to remove supplier", {
        description: error.message,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            supplier and all associated services from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => remove()}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Removing..." : "Remove Supplier"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
