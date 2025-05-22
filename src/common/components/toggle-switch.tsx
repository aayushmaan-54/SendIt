import { ToggleSwitchProps } from "../types/components-types";


export default function ToggleSwitch({
  label,
  checked,
  onChange,
  name,
  isPending,
}: ToggleSwitchProps) {
  return (
    <div>
      <label className="text-sm flex items-center space-x-5">
        <span className="mr-2">{label}</span>
        <input
          type="checkbox"
          checked={checked}
          disabled={isPending}
          name={name}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-accent"
        />
      </label>
    </div>
  );
}
