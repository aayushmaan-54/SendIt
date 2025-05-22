import cn from "../utils/cn";

export default function ProgressBar({ progress, className }: { progress: number, className?: string }) {
  return (
    <div className={cn(`w-full bg-quaternary rounded-full h-2`, className)}>
      <div
        className={cn(
          "bg-accent h-2 rounded-full transition-all duration-300",
          progress === 0 && "opacity-0",
          progress !== 100 ? "rounded-r-none" : "rounded-r-full"
        )}
        style={{ width: `${progress}%` }}
      /></div>
  );
}
