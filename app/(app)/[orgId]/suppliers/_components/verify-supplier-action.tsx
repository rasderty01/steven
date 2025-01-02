"use client";
import { verifySupplier } from "@/app/(app)/[orgId]/suppliers/actions";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export function VerifySupplier({ supplierId }: { supplierId: number }) {
  const queryClient = useQueryClient();

  const { orgId } = useParams() as { orgId: string };

  const { mutate: verify, isPending } = useMutation({
    mutationFn: async () => {
      const result = await verifySupplier(supplierId, parseInt(orgId));
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Supplier verified successfully");
      queryClient.invalidateQueries({ queryKey: ["org-suppliers"] });
    },
    onError: (error) => {
      toast.error("Failed to verify supplier", {
        description: error.message,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted">
          Verify Supplier
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify this supplier?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark the supplier as verified. Verified suppliers are
            trusted partners that have been vetted by your organization.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => verify()}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPending ? "Verifying..." : "Verify Supplier"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
