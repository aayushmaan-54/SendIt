import Icons from "../icons/icons";


export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}


export function getFileType(mimeType?: string, fileName?: string): string {
  if (!mimeType && !fileName) return "other";

  if (mimeType) {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType === "application/pdf") return "pdf";
    if (["application/zip", "application/x-zip-compressed", "application/x-rar-compressed"].includes(mimeType)) {
      return "archive";
    }
  }

  const extension = fileName?.split(".").pop()?.toLowerCase();
  if (!extension) return "other";

  if (["txt", "rtf", "doc", "docx", "odt"].includes(extension)) return "document";
  if (["js", "ts", "jsx", "tsx", "html", "css", "py", "java", "c", "cpp"].includes(extension)) return "code";
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) return "archive";
  if (["pdf"].includes(extension)) return "pdf";
  if (["mp3", "wav", "ogg", "flac"].includes(extension)) return "audio";

  return "other";
}


export function getFileIcon(fileType: string) {
  switch (fileType) {
    case "image":
      return Icons.FileImage;
    case "video":
      return Icons.Video;
    case "audio":
      return Icons.Music;
    case "document":
      return Icons.FileText;
    case "code":
      return Icons.FileCode;
    case "archive":
      return Icons.FileArchive;
    case "pdf":
      return Icons.File;
    default:
      return Icons.File;
  }
}
