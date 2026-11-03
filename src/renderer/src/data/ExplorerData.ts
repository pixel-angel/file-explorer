
export interface ExplorerItem {
  id: string;
  name: string;
  kind: 'folder' | 'file';
  parent: string;
  modified: string;
  size: number;
  type: string;

  // Actual absolute filesystem path for real files.
  path?: string;
}

export const initialPath = 'C:\\Users\\Alex';

export const initialItems: ExplorerItem[] = [
  // Home folders
  { id: 'desktop', name: 'Desktop', kind: 'folder', parent: 'root', modified: 'Today, 9:12 AM', size: 0, type: 'File folder' },
  { id: 'downloads', name: 'Downloads', kind: 'folder', parent: 'root', modified: 'Today, 10:25 AM', size: 0, type: 'File folder' },
  { id: 'documents', name: 'Documents', kind: 'folder', parent: 'root', modified: 'Yesterday, 4:20 PM', size: 0, type: 'File folder' },
  { id: 'pictures', name: 'Pictures', kind: 'folder', parent: 'root', modified: 'Oct 22, 2026', size: 0, type: 'File folder' },
  { id: 'music', name: 'Music', kind: 'folder', parent: 'root', modified: 'Oct 19, 2026', size: 0, type: 'File folder' },
  { id: 'videos', name: 'Videos', kind: 'folder', parent: 'root', modified: 'Oct 18, 2026', size: 0, type: 'File folder' },

  // Desktop contents
  { id: 'desktop-welcome', name: 'Welcome.txt', kind: 'file', parent: 'desktop', modified: 'Today, 9:15 AM', size: 512, type: 'Text Document' },
  { id: 'desktop-demo', name: 'Demo Folder', kind: 'folder', parent: 'desktop', modified: 'Today, 9:20 AM', size: 0, type: 'File folder' },

  // Downloads contents
  { id: 'download-guide', name: 'Folio User Guide.txt', kind: 'file', parent: 'downloads', modified: 'Today, 10:25 AM', size: 1024, type: 'Text Document' },
  { id: 'download-sample', name: 'sample.txt', kind: 'file', parent: 'downloads', modified: 'Today, 10:22 AM', size: 256, type: 'Text Document' },

  // Documents
  { id: 'projects', name: 'Projects', kind: 'folder', parent: 'documents', modified: 'Today, 10:12 AM', size: 0, type: 'File folder' },
  { id: 'college', name: 'College', kind: 'folder', parent: 'documents', modified: 'Yesterday, 3:30 PM', size: 0, type: 'File folder' },
  { id: 'notes', name: 'notes.txt', kind: 'file', parent: 'documents', modified: 'Today, 9:40 AM', size: 4096, type: 'Text Document' },
  { id: 'resume', name: 'Resume.pdf', kind: 'file', parent: 'documents', modified: 'Oct 23, 2026', size: 245760, type: 'PDF Document' },
  { id: 'budget', name: 'budget.xlsx', kind: 'file', parent: 'documents', modified: 'Oct 20, 2026', size: 56320, type: 'Excel Worksheet' },

  // Project folders
  { id: 'folio', name: 'Folio', kind: 'folder', parent: 'projects', modified: 'Today, 10:30 AM', size: 0, type: 'File folder' },
  { id: 'readme', name: 'README.md', kind: 'file', parent: 'projects', modified: 'Today, 10:18 AM', size: 2048, type: 'Markdown File' },
  { id: 'project-plan', name: 'Project Plan.txt', kind: 'file', parent: 'folio', modified: 'Today, 10:35 AM', size: 1024, type: 'Text Document' },
  { id: 'project-tasks', name: 'Tasks.txt', kind: 'file', parent: 'folio', modified: 'Today, 10:36 AM', size: 512, type: 'Text Document' },

  // College
  { id: 'college-os', name: 'Operating Systems', kind: 'folder', parent: 'college', modified: 'Yesterday, 3:30 PM', size: 0, type: 'File folder' },
  { id: 'college-notes', name: 'College Notes.txt', kind: 'file', parent: 'college', modified: 'Yesterday, 3:40 PM', size: 2048, type: 'Text Document' },
  { id: 'os-project', name: 'OS Project.txt', kind: 'file', parent: 'college-os', modified: 'Yesterday, 4:00 PM', size: 1024, type: 'Text Document' },

  // Pictures
  { id: 'design', name: 'design.png', kind: 'file', parent: 'pictures', modified: 'Oct 22, 2026', size: 1048576, type: 'PNG Image' },
  { id: 'wallpaper', name: 'wallpaper.jpg', kind: 'file', parent: 'pictures', modified: 'Oct 20, 2026', size: 2097152, type: 'JPG File' },

  // Music and videos
  { id: 'song', name: 'favorite-song.mp3', kind: 'file', parent: 'music', modified: 'Oct 19, 2026', size: 5242880, type: 'MP3 Audio' },
  { id: 'clip', name: 'weekend.mp4', kind: 'file', parent: 'videos', modified: 'Oct 18, 2026', size: 12582912, type: 'MP4 Video' },
];

// Demo file contents for Folio's preview window.
// These are sample strings—not files stored on your laptop.
export const demoFileContents: Record<string, string> = {
  'desktop-welcome': `Welcome to Folio!

Folio is a simple desktop file explorer project.

You can:
- Browse folders
- Open text files
- Create folders
- Organize demo files

This is a safe demo environment.
Your actual laptop files are not modified.`,

  'download-guide': `FOLIO USER GUIDE

1. Double-click a folder to open it.
2. Double-click a supported text file to preview it.
3. Use the Back button to return.
4. Use the Up button to move to the parent folder.
5. Use the New button to create a folder.

Folio currently uses sample data.`,

  'download-sample': `This is a sample text file.

If you can read this inside Folio, file preview is working!`,

  'notes': `Personal Notes

Remember:
- Finish the OS project
- Prepare for the viva
- Test Folio navigation
- Review the file operations`,

  'readme': `# Folio

A simple file explorer built using:

- React
- TypeScript
- Electron
- C++

Features include folder navigation, file listing, search, and file operations.`,

  'project-plan': `FOLIO PROJECT PLAN

Objective:
Build a desktop file explorer for the Operating Systems project.

Main features:
- Folder navigation
- File listing
- Search
- File preview
- Create and rename items

Technology:
React + Electron + C++`,

  'project-tasks': `PROJECT TASKS

[ ] Complete UI
[ ] Connect Electron IPC
[ ] Integrate C++ backend
[ ] Test folder operations
[ ] Prepare project viva`,

  'college-notes': `COLLEGE NOTES

Operating Systems:
- Process management
- Memory management
- File systems
- CPU scheduling

DBMS:
- SQL
- Normalization
- Transactions`,

  'os-project': `OPERATING SYSTEMS PROJECT

Project: Folio File Explorer

Purpose:
Demonstrate file system concepts and file operations through a desktop interface.

Architecture:
React UI -> Electron -> C++ backend`,

  'desktop-demo': `This is a demo folder for testing navigation.`,
};

export function formatSize(bytes: number) {
  if (bytes === 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}
