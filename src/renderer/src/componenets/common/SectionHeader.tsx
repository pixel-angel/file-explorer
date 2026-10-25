import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  count?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export default function SectionHeader({
  title,
  count,
  actionLabel = "View all",
  onAction,
}: SectionHeaderProps) {
  return (
    <div className="section-title-row">
      <div className="section-title">
        <h2>{title}</h2>

        {count !== undefined && <span className="count-badge">{count}</span>}
      </div>

      <button className="text-button" onClick={onAction}>
        {actionLabel}
        <ChevronRight size={15} />
      </button>
    </div>
  );
}
