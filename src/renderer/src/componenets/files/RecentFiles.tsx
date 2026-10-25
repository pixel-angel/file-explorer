
import type { FileItem } from '../../types/file';
import SectionHeader from '../common/SectionHeader';
import FileRow from './FileRow';

interface RecentFilesProps {
  files: FileItem[];
}

export default function RecentFiles({ files }: RecentFilesProps) {
  return (
    <section className="section-block recent-section">
      <SectionHeader title="Recently opened" count={files.length} />

      <div className="files-panel">
        <div className="files-header">
          <span className="file-name-heading">NAME</span>
          <span>LOCATION</span>
          <span>MODIFIED</span>
          <span>TYPE</span>
          <span />
        </div>

        {files.length > 0 ? (
          files.map((file) => (
            <FileRow key={`${file.location}/${file.name}`} file={file} />
          ))
        ) : (
          <div className="empty-state">
            <p>No matching files.</p>
            <span>Try another filename.</span>
          </div>
        )}
      </div>
    </section>
  );
}
