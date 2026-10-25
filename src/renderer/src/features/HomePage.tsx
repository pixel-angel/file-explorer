import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { folders, recentFiles } from "../../data/mockFiles";
import type { FolderItem } from "../../types/file";

import FolderGrid from "../../components/files/FolderGrid";
import RecentFiles from "../../components/files/RecentFiles";
import SectionHeader from "../../components/common/SectionHeader";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null);

  const filteredFiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return recentFiles.filter((file) =>
      file.name.toLowerCase().includes(query),
    );
  }, [search]);

  function handleOpenFolder(folder: FolderItem) {
    setCurrentFolder(folder);
  }

  return (
    <main className="page-content">
      <div className="welcome-row">
        <div>
          <div className="eyebrow">YOUR SPACE, ORGANIZED</div>

          <h1>{currentFolder ? currentFolder.name : "Good afternoon."}</h1>

          <p className="welcome-subtitle">
            {currentFolder
              ? `Explore your ${currentFolder.name.toLowerCase()} folder.`
              : "A little space for everything that matters."}
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            window.alert("Folder creation will be implemented next.")
          }
        >
          <Plus size={17} />
          New folder
        </button>
      </div>

      {!currentFolder && (
        <section className="section-block">
          <SectionHeader title="Quick access" count={folders.length} />

          <FolderGrid folders={folders} onOpenFolder={handleOpenFolder} />
        </section>
      )}

      <RecentFiles files={filteredFiles} />

      <footer className="page-footer">
        <span>
          folio. <span className="footer-separator">/</span>
          Your files, your space.
        </span>

        <span className="footer-status">
          <span className="status-dot" />
          Demo mode
        </span>
      </footer>
    </main>
  );
}
