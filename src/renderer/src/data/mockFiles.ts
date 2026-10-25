import { FileText, Image, Music, Download } from "lucide-react";

import type { FileItem, FolderItem } from "../types/file";

export const folders: FolderItem[] = [
  {
    name: "Documents",
    description: "Your documents",
    color: "lavender",
    icon: FileText,
    path: "Documents",
  },
  {
    name: "Pictures",
    description: "Photos & images",
    color: "blue",
    icon: Image,
    path: "Pictures",
  },
  {
    name: "Downloads",
    description: "Downloaded files",
    color: "peach",
    icon: Download,
    path: "Downloads",
  },
  {
    name: "Music",
    description: "Audio & music",
    color: "mint",
    icon: Music,
    path: "Music",
  },
];

export const recentFiles: FileItem[] = [
  {
    name: "Project Report.docx",
    location: "Documents · College",
    type: "DOCX",
    modified: "Today",
    color: "lavender",
  },
  {
    name: "Presentation.pdf",
    location: "Documents · OS Project",
    type: "PDF",
    modified: "Yesterday",
    color: "peach",
  },
  {
    name: "Screenshot.png",
    location: "Pictures · Screenshots",
    type: "PNG",
    modified: "Yesterday",
    color: "blue",
  },
  {
    name: "main.cpp",
    location: "Documents · File Explorer",
    type: "CPP",
    modified: "2 days ago",
    color: "mint",
  },
];
