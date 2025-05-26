/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Icons from "@/common/icons/icons";
import { formatFileSize, getFileType } from "@/common/utils/file-utils";
import { useEffect, useState } from "react";
import RenderFileThumbnail from "./render-file-thumbnail";

interface FilePreviewProps {
  file: any;
  fileUrl: string;
}



export default function FilePreview({
  file,
  fileUrl
}: FilePreviewProps) {
  const [fileType, setFileType] = useState<string>("other");
  const [isDownloading, setIsDownloading] = useState(false);


  useEffect(() => {
    setFileType(getFileType(file.type, file.name));
  }, [file]);


  const handleDownload = async () => {
    try {
      // TODO: Check for file expiry genrate file access token
      setIsDownloading(true);
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <>
      <div className="flex items-center gap-3 p-2 hover:bg-tertiary transition-colors w-full [&:not(:last-child)]:mb-0.5">
        <RenderFileThumbnail file={file} fileType={fileType} fileUrl={fileUrl} />

        <div className="flex-1 overflow-hidden min-w-0 text-left">
          <p className="text-sm truncate" title={file.name}>
            {file.name}
          </p>

          <p className="text-xs text-muted-text truncate">
            {formatFileSize(file.size)}
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="size-6 rounded flex items-center justify-center transition-colors flex-shrink-0 hover:bg-muted-text/20 disabled:cursor-not-allowed disabled:opacity-50"
          title={`Download ${file.name}`}
        >
          <Icons.Download className="size-4" />
          <span className="sr-only">Download file</span>
        </button>
      </div>
    </>
  );
}
