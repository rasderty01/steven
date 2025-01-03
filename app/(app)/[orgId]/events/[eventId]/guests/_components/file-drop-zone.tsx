"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropZoneProps {
  onFileUpload: (file: File) => void;
}

export default function FileDropZone({ onFileUpload }: FileDropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer
        ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag and drop a file here, or click to select a file</p>
      )}
    </div>
  );
}
