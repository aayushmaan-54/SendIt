import Image from "next/image";
import Icons from "@/common/icons/icons";
import { getFileIcon } from "@/common/utils/file-utils";

interface RenderFileProps {
  file: {
    name: string;
    uploadThingUrl: string;
  };
  fileType: string;
  fileUrl: string;
}



export default function RenderFileThumbnail({ file, fileType, fileUrl }: RenderFileProps) {
  if (fileType === "image") {
    return (
      <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 border border-border">
        <Image
          src={fileUrl}
          alt={file.name}
          width={32}
          height={32}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  if (fileType === "video") {
    return (
      <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 border border-border relative">
        <video
          src={fileUrl}
          className="object-cover w-full h-full"
          muted
          playsInline
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Icons.Video className="size-3 text-white" />
        </div>
      </div>
    );
  }

  const FileIcon = getFileIcon(fileType);
  return (
    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0 border border-border">
      <FileIcon className="size-3.5" />
    </div>
  );
}
