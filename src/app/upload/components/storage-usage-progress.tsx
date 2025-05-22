import ProgressBar from "@/common/components/progress-bar";
import { formatFileSize } from "@/common/utils/file-utils";


export default function StorageUsageProgress({ totalSize, usedPercentage}: {
  totalSize: number; usedPercentage: number;}) {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center text-sm font-bold my-3">
        <div className="flex items-center justify-between w-full">
          <span>Storage used</span>
          <span>{formatFileSize(totalSize)}/{process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB!}MB({usedPercentage}%)</span>
        </div>
        <ProgressBar progress={usedPercentage} />
      </div>
    </>
  );
}
