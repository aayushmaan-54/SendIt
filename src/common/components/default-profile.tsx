import cn from "../utils/cn"

export default function DefaultProfile({
  letter = "",
  className = "",
}) {
  return (
    <div className={cn("flex size-8 items-center justify-center rounded-md text-primary-text font-black bg-accent/50 border border-accent-border select-none cursor-pointer hover:bg-accent/70 transition-all duration-200 ease-in-out", className)}>
      {letter.toUpperCase()}
    </div>
  );
}
