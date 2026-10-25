
interface Props {
  name: string;
  kind: 'folder' | 'file';
  size?: number;
}

const types: Record<string, { color: string; label: string }> = {
  pdf: { color: '#E84C3D', label: 'PDF' },
  doc: { color: '#2875C7', label: 'W' },
  docx: { color: '#2875C7', label: 'W' },
  xls: { color: '#168653', label: 'X' },
  xlsx: { color: '#168653', label: 'X' },
  csv: { color: '#168653', label: 'X' },
  ppt: { color: '#D65332', label: 'P' },
  pptx: { color: '#D65332', label: 'P' },
  ts: { color: '#3178C6', label: 'TS' },
  tsx: { color: '#3178C6', label: 'TSX' },
  js: { color: '#C5A52B', label: 'JS' },
  jsx: { color: '#C5A52B', label: 'JSX' },
  cpp: { color: '#4479C4', label: 'C++' },
  mp3: { color: '#C64F91', label: '♫' },
  wav: { color: '#C64F91', label: '♫' },
  mp4: { color: '#7757D9', label: '▶' },
  mov: { color: '#7757D9', label: '▶' },
  zip: { color: '#B88B35', label: 'ZIP' },
  txt: { color: '#8291A5', label: 'TXT' },
  md: { color: '#65758B', label: 'MD' },
  css: { color: '#3979D6', label: '#' },
  html: { color: '#E36D43', label: '5' },
};

export default function FileTypeIcon({
  name,
  kind,
  size = 22,
}: Props) {
  const extension = name.split('.').pop()?.toLowerCase() ?? '';
  const type = types[extension] ?? {
    color: '#718096',
    label: 'FILE',
  };

  if (kind === 'folder') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 28"
        aria-hidden="true"
      >
        <path
          d="M2 5A3 3 0 0 1 5 2H13L17 6H27A3 3 0 0 1 30 9V23A3 3 0 0 1 27 26H5A3 3 0 0 1 2 23Z"
          fill="#D99A25"
        />
        <path
          d="M2 11A3 3 0 0 1 5 8H27A3 3 0 0 1 30 11V23A3 3 0 0 1 27 26H5A3 3 0 0 1 2 23Z"
          fill="#F7C84B"
        />
        <path d="M4 11H28" stroke="#FFE9A1" strokeWidth="1.5" />
      </svg>
    );
  }

  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 36"
      aria-hidden="true"
    >
      <path
        d="M4 1H20L29 10V32A3 3 0 0 1 26 35H4A3 3 0 0 1 1 32V4A3 3 0 0 1 4 1Z"
        fill="#F4F7FB"
        stroke="#CCD5E2"
      />
      <path d="M20 1V8A2 2 0 0 0 22 10H29" fill="#DCE5F0" stroke="#CCD5E2" />
      {isImage ? (
        <>
          <circle cx="11" cy="17" r="2.5" fill="#F3C34E" />
          <path d="M4 28L12 20L17 24L22 18L28 26V30H4Z" fill="#55A9E8" />
        </>
      ) : (
        <>
          <path d="M4 14H28V29H4Z" fill={type.color} />
          <text
            x="16"
            y="24"
            textAnchor="middle"
            fontSize={type.label.length > 3 ? 7 : 10}
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            fill="#FFFFFF"
          >
            {type.label}
          </text>
        </>
      )}
    </svg>
  );
}
