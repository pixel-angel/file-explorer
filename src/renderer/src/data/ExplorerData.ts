
export type ExplorerItem = {
  id: string;
  name: string;
  kind: 'folder' | 'file';
  parent: string;
  modified: string;
  size: number;
  type: string;
};

export const initialPath = 'C:\\Users\\Alex';

export const initialItems: ExplorerItem[] = [
  { id: 'desktop', name: 'Desktop', kind: 'folder', parent: 'root', modified: 'Today, 9:12 AM', size: 0, type: 'File folder' },
  { id: 'downloads', name: 'Downloads', kind: 'folder', parent: 'root', modified: 'Today, 10:25 AM', size: 0, type: 'File folder' },
  { id: 'documents', name: 'Documents', kind: 'folder', parent: 'root', modified: 'Yesterday, 4:20 PM', size: 0, type: 'File folder' },
  { id: 'pictures', name: 'Pictures', kind: 'folder', parent: 'root', modified: 'Oct 22, 2026', size: 0, type: 'File folder' },
  { id: 'music', name: 'Music', kind: 'folder', parent: 'root', modified: 'Oct 19, 2026', size: 0, type: 'File folder' },
  { id: 'videos', name: 'Videos', kind: 'folder', parent: 'root', modified: 'Oct 18, 2026', size: 0, type: 'File folder' },

  { id: 'projects', name: 'Projects', kind: 'folder', parent: 'documents', modified: 'Today, 10:12 AM', size: 0, type: 'File folder' },
  { id: 'college', name: 'College', kind: 'folder', parent: 'documents', modified: 'Yesterday, 3:30 PM', size: 0, type: 'File folder' },
  { id: 'notes', name: 'notes.txt', kind: 'file', parent: 'documents', modified: 'Today, 9:40 AM', size: 4096, type: 'Text Document' },
  { id: 'resume', name: 'Resume.pdf', kind: 'file', parent: 'documents', modified: 'Oct 23, 2026', size: 245760, type: 'PDF Document' },
  { id: 'budget', name: 'budget.xlsx', kind: 'file', parent: 'documents', modified: 'Oct 20, 2026', size: 56320, type: 'Excel Worksheet' },

  { id: 'folio', name: 'Folio', kind: 'folder', parent: 'projects', modified: 'Today, 10:30 AM', size: 0, type: 'File folder' },
  { id: 'readme', name: 'README.md', kind: 'file', parent: 'projects', modified: 'Today, 10:18 AM', size: 2048, type: 'Markdown File' },
  { id: 'design', name: 'design.png', kind: 'file', parent: 'pictures', modified: 'Oct 22, 2026', size: 1048576, type: 'PNG Image' },
  { id: 'wallpaper', name: 'wallpaper.jpg', kind: 'file', parent: 'pictures', modified: 'Oct 20, 2026', size: 2097152, type: 'JPG File' },
  { id: 'song', name: 'favorite-song.mp3', kind: 'file', parent: 'music', modified: 'Oct 19, 2026', size: 5242880, type: 'MP3 Audio' },
  { id: 'clip', name: 'weekend.mp4', kind: 'file', parent: 'videos', modified: 'Oct 18, 2026', size: 12582912, type: 'MP4 Video' },
];

export function formatSize(bytes: number) {
  if (bytes === 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}
