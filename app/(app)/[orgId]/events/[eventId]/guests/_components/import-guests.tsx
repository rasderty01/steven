"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Papa from "papaparse";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import DataPreviewTable from "./data-preview-table";
import FileDropZone from "./file-drop-zone";
import { useSidebar } from "@/components/ui/sidebar";
import { is } from "date-fns/locale";

export function ImportGuestsDialog() {
  const params = useParams();
  const eventId = parseInt(params.eventId as string);

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isMobile } = useSidebar();

  const importMutation = useMutation({
    mutationFn: async (data: any[]) => {
      const formattedData = data.map((row) => ({
        firstName: row.firstName || null,
        lastName: row.lastName || "",
        email: row.email || null,
        phoneNumber: row.phoneNumber || null,
        title: row.title || null,
        role: row.role || null,
        eventId,
      }));

      return fetch("/api/guests/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests: formattedData, eventId }),
      }).then((res) => {
        if (!res.ok) throw new Error("Import failed");
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      queryClient.invalidateQueries({ queryKey: ["importHistory", eventId] });
      toast.success("Guests imported successfully");
      resetImport();
      setOpen(false);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(`Import failed: ${error.message}`);
    },
  });

  const resetImport = () => {
    setFile(null);
    setPreviewData([]);
    setProgress(0);
    setTotalRows(0);
  };

  const processExcelFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet);
    return data;
  };

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);

    try {
      if (uploadedFile.name.endsWith(".csv")) {
        // Handle CSV
        Papa.parse(uploadedFile, {
          preview: 5,
          header: true,
          complete: (results) => {
            setPreviewData(results.data);
          },
        });

        Papa.parse(uploadedFile, {
          header: true,
          complete: (results) => {
            setTotalRows(results.data.length);
          },
        });
      } else if (uploadedFile.name.match(/\.xlsx?$/)) {
        // Handle Excel
        const data = await processExcelFile(uploadedFile);
        setPreviewData(data.slice(0, 5));
        setTotalRows(data.length);
      }
    } catch (error) {
      toast.error("Error processing file");
      resetImport();
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      if (file.name.endsWith(".csv")) {
        // Process CSV in batches
        let processedRows = 0;
        const batchSize = 100;
        let currentBatch: any[] = [];

        Papa.parse(file, {
          header: true,
          step: (row) => {
            currentBatch.push(row.data);
            processedRows++;

            if (currentBatch.length === batchSize) {
              importMutation.mutate(currentBatch);
              currentBatch = [];
            }

            setProgress(Math.round((processedRows / totalRows) * 100));
          },
          complete: () => {
            if (currentBatch.length > 0) {
              importMutation.mutate(currentBatch);
            }
            setProgress(100);
          },
        });
      } else if (file.name.match(/\.xlsx?$/)) {
        // Process Excel file
        const data = await processExcelFile(file);

        // Process in batches
        const batchSize = 100;
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          await importMutation.mutateAsync(batch);
          setProgress(Math.round(((i + batch.length) / data.length) * 100));
        }
      }
    } catch (error) {
      toast.error("Error processing file");
      resetImport();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetImport();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={isMobile ? "sm" : "default"}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <Upload className="size-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Import Guests</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button asChild variant="outline" size="sm">
              <a href="/templates/guest_import_template.csv" download>
                Download Template
              </a>
            </Button>
          </div>

          <FileDropZone onFileUpload={handleFileUpload} />

          {file && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Preview ({file.name})</h3>
              <DataPreviewTable data={previewData} />
              <Progress value={progress} className="h-2" />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    resetImport();
                    setOpen(false);
                  }}
                  disabled={importMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={importMutation.isPending}
                >
                  {importMutation.isPending ? "Importing..." : "Start Import"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
