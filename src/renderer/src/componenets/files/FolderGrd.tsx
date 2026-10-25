import FolderCard from "./FolderCard";
import type { FolderItem } from "../../types/file";

interface FolderGridProps {
  folders: FolderItem[];
  onOpenFolder?: (folder: FolderItem) => void;
}

export default function FolderGrid({ folders, onOpenFolder }: FolderGridProps) {
  return (
    <div className="folder-grid">
      {folders.map((folder) => (
        <FolderCard key={folder.path} folder={folder} onOpen={onOpenFolder} />
      ))}
    </div>
  );
}
