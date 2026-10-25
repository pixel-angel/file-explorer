import { FileText, MoreHorizontal } from 'lucide-react';

import IconButton from '../common/IconButton';
import type { FileItem } from '../../types/file';

interface FileRowProps {
  file: FileItem;
}

export default function FileRow({ file }: FileRowProps) {
  return (
    <div className="file-row">
      <div className="file-name-cell">
        <div className={`file-type-icon ${file.color}`}>
          <FileText size={18} />
        </div>

        <span className="file-name" title={file.name}>
          {file.name}
        </span>
      </div>

      <span className="file-location" title={file.location}>
        {file.location}
      </span>

      <span className="file-modified">{file.modified}</span>

      <span className="file-extension">{file.type}</span>

      <IconButton
        className="row-menu"
        aria-label={`Options for ${file.name}`}
      >
        <MoreHorizontal size={18} />
      </IconButton>
    </div>
  );
}