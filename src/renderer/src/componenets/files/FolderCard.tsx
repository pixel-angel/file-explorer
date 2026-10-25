import { ChevronRight, MoreHorizontal } from 'lucide-react';

import type { FolderItem } from '../../types/file';

interface FolderCardProps {
  folder: FolderItem;
  onOpen?: (folder: FolderItem) => void;
}

export default function FolderCard({
  folder,
  onOpen,
}: FolderCardProps) {
  const Icon = folder.icon;

  return (
    <button
      className={`folder-card ${folder.color}`}
      onClick={() => onOpen?.(folder)}
      aria-label={`Open ${folder.name}`}
    >
      <div className="folder-card-top">
        <div className="folder-icon">
          <Icon size={21} strokeWidth={1.8} />
        </div>

        <MoreHorizontal
          size={19}
          className="folder-menu"
          aria-hidden="true"
        />
      </div>

      <div className="folder-card-bottom">
        <div>
          <h3>{folder.name}</h3>
          <p>{folder.description}</p>
        </div>

        <ChevronRight
          size={16}
          className="folder-arrow"
          aria-hidden="true"
        />
      </div>
    </button>
  );
}