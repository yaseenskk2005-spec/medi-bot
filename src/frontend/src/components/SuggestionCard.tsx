import type { LucideIcon } from "lucide-react";

interface SuggestionCardProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  index: number;
}

export default function SuggestionCard({
  icon: Icon,
  label,
  onClick,
  index,
}: SuggestionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`suggestion.item.${index}`}
      className="group flex flex-col items-start gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-smooth text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
        <Icon className="w-[18px] h-[18px] text-primary" aria-hidden="true" />
      </div>
      <span className="text-sm font-body text-foreground leading-snug line-clamp-2">
        {label}
      </span>
    </button>
  );
}
