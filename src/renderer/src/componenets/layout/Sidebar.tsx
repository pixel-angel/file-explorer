import {
  Home,
  FolderOpen,
  Clock3,
  Star,
  Trash2,
  HardDrive,
  Settings,
  Plus,
  FileText,
  Image,
} from "lucide-react";

import IconButton from "../common/IconButton";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onClose?: () => void;
}

const navigation = [
  { label: "Home", icon: Home },
  { label: "My Files", icon: FolderOpen },
  { label: "Recent", icon: Clock3 },
  { label: "Favorites", icon: Star },
  { label: "Trash", icon: Trash2 },
];

export default function Sidebar({
  activePage,
  onNavigate,
  onClose,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <FolderOpen size={21} />
        </div>

        <span className="brand-name">
          folio<span>.</span>
        </span>

        <IconButton
          className="mobile-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          ×
        </IconButton>
      </div>

      <div className="workspace-label">WORKSPACE</div>

      <nav className="navigation">
        {navigation.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${activePage === label ? "active" : ""}`}
            onClick={() => onNavigate(label)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-divider" />

      <div className="section-heading">
        <span>FAVOURITES</span>

        <IconButton aria-label="Add favourite">
          <Plus size={15} />
        </IconButton>
      </div>

      <button className="favourite-item">
        <span className="mini-folder lavender-bg">
          <FileText size={14} />
        </span>
        <span>College</span>
        <Star size={13} className="favourite-star" />
      </button>

      <button className="favourite-item">
        <span className="mini-folder blue-bg">
          <FolderOpen size={14} />
        </span>
        <span>Projects</span>
      </button>

      <button className="favourite-item">
        <span className="mini-folder peach-bg">
          <Image size={14} />
        </span>
        <span>Design assets</span>
      </button>

      <div className="sidebar-bottom">
        <div className="storage-heading">
          <HardDrive size={16} />
          <span>Storage</span>
        </div>

        <div className="storage-bar">
          <div className="storage-used" />
        </div>

        <p className="storage-caption">Storage data will be connected later.</p>

        <button className="nav-item settings-item">
          <Settings size={17} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
