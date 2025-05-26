/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import JSZip from "jszip";

interface DownloadAllAsZipButtonProps {
  files: any[];
}



export default function DownloadZipButton({ files }: DownloadAllAsZipButtonProps) {
  const [isZipping, setIsZipping] = useState(false);


  const handleDownloadAllAsZip = async () => {
    if (files.length === 0) {
      toast.error("No files to download.");
      return;
    }

    setIsZipping(true);
    const toastId = toast.loading("Preparing files for download...", {
      position: "bottom-right",
    });

    try {
      const zip = new JSZip();
      let filesProcessed = 0;

      for (const file of files) {
        toast.loading(`Downloading ${file.name}... (${filesProcessed + 1}/${files.length})`, {
          id: toastId,
          position: "bottom-right",
        });

        try {
          const response = await fetch(file.uploadThingUrl);
          if (!response.ok) {
            throw new Error(`Failed to download ${file.name}: ${response.statusText}`);
          }
          const blob = await response.blob();
          zip.file(file.name, blob);
          filesProcessed++;
        } catch (downloadError) {
          console.error(`Error downloading ${file.name}:`, downloadError);
          toast.error(`Failed to download ${file.name}. Skipping.`, { duration: 3000 });
          continue;
        }
      }

      if (filesProcessed === 0) {
        toast.error("No files could be downloaded.", { id: toastId });
        return;
      }

      toast.loading("Zipping files...", {
        id: toastId,
        position: "bottom-right",
      });

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
      }, (metadata) => {
        const progress = metadata.percent.toFixed(0);
        if (metadata.currentFile) {
          toast.loading(`Zipping: ${metadata.currentFile} (${progress}%)`, {
            id: toastId,
            position: "bottom-right",
          });
        } else {
          toast.loading(`Zipping progress: ${progress}%`, {
            id: toastId,
            position: "bottom-right",
          });
        }
      });

      const zipFileName = `shared_files_${Date.now()}.zip`;

      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Successfully downloaded ${filesProcessed} files as ZIP!`, {
        id: toastId,
        duration: 4000
      });

    } catch (error) {
      console.error("Error zipping and downloading files:", error);
      toast.error(`Download failed: ${error instanceof Error ? error.message : "Unknown error"}`, {
        id: toastId,
        duration: 5000
      });
    } finally {
      setIsZipping(false);
    }
  };


  return (
    <button
      onClick={handleDownloadAllAsZip}
      disabled={isZipping || files.length === 0}
      className="button-accent my-7 mb-10 w-full"
    >
      {isZipping ? "Downloading..." : `Download ZIP (${files.length} files)`}
    </button>
  );
}
