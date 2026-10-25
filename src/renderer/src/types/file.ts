import type { LucideIcon } from 'lucide-react';

export interface FolderItem {
  name: string;
  description: string;
  color: 'lavender' | 'blue' | 'peach' | 'mint';
  icon: LucideIcon;
  path: string;
}

export interface FileItem {
  name: string;
  location: string;
  type: string;
  modified: string;
  color: 'lavender' | 'blue' | 'peach' | 'mint';
}