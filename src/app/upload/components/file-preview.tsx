"use client";
import Icons from "@/common/icons/icons";
import { FilePreviewProps } from "@/common/types/files";
import RenderFileThumbnail from "@/common/components/render-file-thumbnail";
import { formatFileSize, getFileType } from "@/common/utils/file-utils";
import { useEffect, useState } from "react";


export default function FilePreview({
  file,
  onRemove,
  isUploading
}: FilePreviewProps) {
  const [fileType, setFileType] = useState<string>("other");

  useEffect(() => {
    setFileType(getFileType(file.type, file.name));
  }, [file]);


  return (
    <>
      <div className="flex items-center gap-3 p-2 hover:bg-tertiary transition-colors w-full [&:not(:last-child)]:mb-0.5">
        <RenderFileThumbnail file={file} fileType={fileType} />

        <div className="flex-1 overflow-hidden min-w-0">
          <p className="text-sm truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-muted-text truncate">
            {formatFileSize(file.size)}
          </p>
        </div>

        <button
          type="button"
          disabled={isUploading}
          className="size-5 rounded flex items-center justify-center transition-colors flex-shrink-0 hover:bg-muted-text/20 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Icons.X className="size-3" />
          <span className="sr-only">Remove file</span>
        </button>
      </div>
    </>
  );
}
