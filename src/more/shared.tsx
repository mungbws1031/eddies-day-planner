import { ChevronLeft } from "lucide-react";

export function PanelHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-1 px-3 pb-2 pt-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--e-text-muted)] active:bg-[var(--e-surface-2)]"
      >
        <ChevronLeft size={20} strokeWidth={2.4} />
      </button>
      <h2 className="text-[17px] font-extrabold text-[var(--e-text)]">{title}</h2>
    </div>
  );
}

export function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--e-r-md)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3.5 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-[var(--e-text)]">{label}</p>
        {desc && <p className="mt-0.5 text-[11px] text-[var(--e-text-subtle)]">{desc}</p>}
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative h-7 w-12 shrink-0 rounded-full transition-colors"
      style={{ background: checked ? "var(--e-primary)" : "var(--e-border-strong)" }}
    >
      <span
        className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform"
        style={{ transform: checked ? "translateX(20px)" : "translateX(2px)" }}
      />
    </button>
  );
}

export function TextField({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`min-w-0 rounded-[var(--e-r-sm)] border border-[var(--e-border)] bg-[var(--e-surface)] px-3 py-2 text-[14px] font-semibold text-[var(--e-text)] outline-none placeholder:text-[var(--e-text-subtle)] focus:border-[var(--e-primary)] ${className}`}
    />
  );
}
