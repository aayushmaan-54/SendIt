"use client";
import Icons from "@/common/icons/icons";
import { DropzoneProps } from "@/common/types/files";
import cn from "@/common/utils/cn";


export default function Dropzone({
  onFilesAdded,
  isUploading,
  isDragging,
  setIsDragging,
  fileInputRef,
}: DropzoneProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragging(true);
  };


  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!isUploading && e.dataTransfer.files) {
      onFilesAdded(e.dataTransfer.files);
    }
  };


  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isUploading) {
      onFilesAdded(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };


  const triggerFileInput = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={cn(
          "border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer transition-colors mt-10",
          "hover:border-primary-text hover:bg-tertiary",
          "w-[90vw] sm:w-[80vw] lg:w-[800px] mx-auto h-[250px] sm:h-[300px] flex items-center justify-center",
          isDragging && "border-success bg-success/10",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={fileInputRef}
          name="files"
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="sr-only"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-lg">
          <div className="rounded-full bg-primary p-4 shadow-sm">
            <Icons.FileUp className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold">
              {isDragging
                ? "Drop files here"
                : isUploading
                  ? "Uploading files..."
                  : "Drag & drop files or click to upload"}
            </h3>
            <p className="text-sm text-muted-text mx-auto">
              Select multiple files up to {process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB!}MB total.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
