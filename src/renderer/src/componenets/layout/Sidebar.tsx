
import {
  Home, Monitor, Download, FileText, Image, Music, Video,
  HardDrive, Star, Clock3, Settings, FolderOpen,
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

const mainLinks = [
  { label: 'Home', icon: Home },
  { label: 'Gallery', icon: Image },
];

const pinnedLinks = [
  { label: 'Desktop', icon: Monitor },
  { label: 'Downloads', icon: Download },
  { label: 'Documents', icon: FileText },
  { label: 'Pictures', icon: Image },
  { label: 'Music', icon: Music },
  { label: 'Videos', icon: Video },
];

export default function Sidebar({ onNavigate }: Props) {
  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-mark"><FolderOpen size={21} /></div>
        <div>
          <div className="brand-name">folio<span>.</span></div>
          <div className="brand-caption">FILE EXPLORER</div>
        </div>
      </div>

      <div className="nav-group">
        <div className="nav-heading">QUICK ACCESS</div>
        {mainLinks.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${label === 'Home' ? 'active' : ''}`}
            onClick={() => onNavigate(label)}
          >
            <Icon size={17} /><span>{label}</span>
          </button>
        ))}
      </div>

      <div className="nav-group">
        <div className="nav-heading">PINNED</div>
        {pinnedLinks.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="nav-item"
            onClick={() => onNavigate(label)}
          >
            <Icon size={17} /><span>{label}</span>
          </button>
        ))}
      </div>

      <div className="nav-group">
        <div className="nav-heading">THIS PC</div>
        <button className="nav-item" onClick={() => onNavigate('This PC')}>
          <HardDrive size={17} /><span>Local Disk (C:)</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate('Recent')}>
          <Clock3 size={17} /><span>Recent</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate('Favorites')}>
          <Star size={17} /><span>Favorites</span>
        </button>
      </div>

      <div className="sidebar-bottom">
        <div className="storage-card">
          <div className="storage-title"><HardDrive size={15} /> Local Disk (C:)</div>
          <div className="storage-track"><span /></div>
          <div className="storage-caption">128 GB free of 256 GB</div>
        </div>
        <button className="nav-item" onClick={() => onNavigate('Settings')}>
          <Settings size={17} /><span>Settings</span>
        </button>
        <div className="demo-label"><span /> Mock filesystem · Offline</div>
      </div>
    </div>
  );
}
