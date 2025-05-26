import { CustomRadioProps } from "../types/components-types";

export default function CustomRadio({
  name,
  label,
  value,
  checked,
  onChange,
  isPending,
}: CustomRadioProps) {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending) return;

    // Create a synthetic change event
    const syntheticEvent = {
      target: {
        name,
        value,
        checked: !checked
      },
      preventDefault: () => {},
      stopPropagation: () => {}
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <div
      className="flex items-center disabled:cursor-not-allowed space-x-2 cursor-pointer py-1.5 group"
      onClick={handleClick}
    >
      <div className="relative flex items-center disabled:cursor-not-allowed justify-center">
        {/* Remove the actual input element completely to avoid form submission */}
        <div
          className={`size-5 disabled:cursor-not-allowed rounded-full border-2 transition-colors duration-200 ease-in-out flex items-center justify-center
            ${
              checked
                ? `border-accent bg-accent`
                : 'border-border group-hover:border-accent-hover'
            }`}
        >
          {checked && (
            <div className="size-3 bg-primary rounded-full absolute disabled:cursor-not-allowed" />
          )}
        </div>
      </div>
      <span className="text-sm disabled:cursor-not-allowed">{label}</span>
    </div>
  );
}
