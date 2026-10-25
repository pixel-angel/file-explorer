
import { Menu, Search, Command } from 'lucide-react';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
}

export default function Topbar({
  search,
  onSearchChange,
  onMenuClick,
}: Props) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={19} />
      </button>

      <div className="topbar-title">
        <span className="topbar-title-dot" />
        <span>Folio</span>
        <span className="topbar-separator">/</span>
        <span className="topbar-current">File Explorer</span>
      </div>

      <label className="global-search">
        <Search size={16} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search files and folders"
          aria-label="Search files and folders"
        />
        <kbd><Command size={11} /> K</kbd>
      </label>

      <div className="avatar" title="Demo profile">A</div>
    </header>
  );
}
