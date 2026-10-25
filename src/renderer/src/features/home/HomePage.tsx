
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import FileTypeIcon from '../../componenets/icons/FileTypeIcon';
import {
  ArrowLeft, ArrowRight, ArrowUp, RefreshCw, ChevronRight,
  Search, Plus, SlidersHorizontal, LayoutGrid, List,
  Folder, MoreHorizontal, PanelRight,
  X, Pencil, Trash2,HardDrive, Home, Check,
} from 'lucide-react';
import {
  initialItems,
  formatSize,
  type ExplorerItem,
} from '../../data/ExplorerData';

type ViewMode = 'details' | 'grid';


function fileIcon(item: ExplorerItem, size = 19) {
  return (
    <FileTypeIcon
      name={item.name}
      kind={item.kind}
      size={size}
    />
  );
}


export default function HomePage({ search }: { search: string }) {
  const [items, setItems] = useState(initialItems);
  const [openBreadcrumb, setOpenBreadcrumb] = useState<string | null>(null);
  const [current, setCurrent] = useState('root');
  const [history, setHistory] = useState<string[]>(['root']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('details');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'type' | 'size'>('name');
  const [ascending, setAscending] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [dialog, setDialog] = useState<'new' | 'rename' | null>(null);
  const [inputName, setInputName] = useState('');
  const [notice, setNotice] = useState('');

  const selectedItem = items.find(item => item.id === selected) ?? null;
  const selectedExtension =
  selectedItem?.name.split('.').pop()?.toLowerCase() ?? '';

const isImageFile = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(selectedExtension);
const isTextFile = ['txt', 'md', 'markdown'].includes(selectedExtension);

  const currentFolder = items.find(item => item.id === current);
  const locationName = current === 'root' ? 'Home' : currentFolder?.name ?? 'Home';

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    let result = items.filter(item => {
      if (query) return item.name.toLowerCase().includes(query);
      return item.parent === current;
    });
    result = [...result].sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1;
      let comparison = 0;
      if (sortBy === 'size') comparison = a.size - b.size;
      else if (sortBy === 'modified') comparison = a.modified.localeCompare(b.modified);
      else if (sortBy === 'type') comparison = a.type.localeCompare(b.type);
      else comparison = a.name.localeCompare(b.name);
      return ascending ? comparison : -comparison;
    });
    return result;
  }, [items, current, search, sortBy, ascending]);

  function goTo(id: string) {
    setCurrent(id);
    setSelected(null);
    setHistory(previous => [...previous.slice(0, historyIndex + 1), id]);
    setHistoryIndex(previous => previous + 1);
  }

  function goBack() {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    setCurrent(history[nextIndex]);
    setSelected(null);
  }

  function goForward() {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    setCurrent(history[nextIndex]);
    setSelected(null);
  }

  function goUp() {
    if (current === 'root') return;
    const parent = items.find(item => item.id === current)?.parent ?? 'root';
    goTo(parent);
  }

  function openItem(item: ExplorerItem) {
    if (item.kind === 'folder') goTo(item.id);
    else {
      setSelected(item.id);
      setNotice(`"${item.name}" is a mock file. Opening files will be supported after filesystem integration.`);
    }
  }

  function submitDialog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = inputName.trim();
    if (!name) return;
    if (items.some(item => item.parent === current && item.name.toLowerCase() === name.toLowerCase())) {
      setNotice('An item with that name already exists.');
      return;
    }

    if (dialog === 'new') {
      const newItem: ExplorerItem = {
        id: `mock-${Date.now()}`,
        name,
        kind: 'folder',
        parent: current,
        modified: 'Just now',
        size: 0,
        type: 'File folder',
      };
      setItems(previous => [...previous, newItem]);
      setSelected(newItem.id);
      setNotice(`Created mock folder "${name}".`);
    } else if (dialog === 'rename' && selectedItem) {
      setItems(previous => previous.map(item =>
        item.id === selectedItem.id
          ? { ...item, name, type: item.kind === 'folder' ? 'File folder' : `${name.split('.').pop()?.toUpperCase() ?? 'File'} File`, modified: 'Just now' }
          : item,
      ));
      setNotice(`Renamed item to "${name}".`);
    }
    setDialog(null);
    setInputName('');
  }

  function deleteSelected() {
    if (!selectedItem) return;
    if (!window.confirm(`Remove "${selectedItem.name}" from the mock filesystem?`)) return;
    const removeIds = new Set<string>([selectedItem.id]);
    let changed = true;
    while (changed) {
      changed = false;
      items.forEach(item => {
        if (removeIds.has(item.parent) && !removeIds.has(item.id)) {
          removeIds.add(item.id);
          changed = true;
        }
      });
    }
    setItems(previous => previous.filter(item => !removeIds.has(item.id)));
    setSelected(null);
    setNotice('Removed from mock data only.');
  }

  const pathParts = current === 'root'
    ? [{ id: 'root', name: 'Home' }]
    : (() => {
        const result: { id: string; name: string }[] = [];
        let cursor: string | undefined = current;
        while (cursor && cursor !== 'root') {
          const item = items.find(entry => entry.id === cursor);
          if (!item) break;
          result.unshift({ id: item.id, name: item.name });
          cursor = item.parent;
        }
        return [{ id: 'root', name: 'Home' }, ...result];
      })();

  return (
    <main className="explorer-page">
      <div className="explorer-navigation">
        <div className="nav-history">
          <button className="icon-button" onClick={goBack} disabled={historyIndex === 0} title="Back"><ArrowLeft /></button>
          <button className="icon-button" onClick={goForward} disabled={historyIndex >= history.length - 1} title="Forward"><ArrowRight /></button>
          <button className="icon-button" onClick={goUp} disabled={current === 'root'} title="Up"><ArrowUp /></button>
          <button className="icon-button" onClick={() => setNotice('View refreshed. Mock data is up to date.')} title="Refresh"><RefreshCw /></button>
        </div>

        <div className="address-bar">
          <Home size={15} className="address-home" />
          {pathParts.map((part, index) => {
  const childFolders = items.filter(
    item => item.kind === 'folder' && item.parent === part.id,
  );

  return (
    <span className="breadcrumb" key={part.id}>
      {index > 0 && <ChevronRight size={13} />}
      <button onClick={() => {
        goTo(part.id);
        setOpenBreadcrumb(null);
      }}>
        {part.name}
      </button>

      <span className="breadcrumb-menu-wrap">
        <button
          className="breadcrumb-chevron"
          aria-label={`Show folders in ${part.name}`}
          aria-expanded={openBreadcrumb === part.id}
          onClick={() => setOpenBreadcrumb(
            value => value === part.id ? null : part.id,
          )}
        >
          <ChevronDown size={12} />
        </button>

        {openBreadcrumb === part.id && (
          <span className="breadcrumb-dropdown">
            <button
              className="breadcrumb-option"
              onClick={() => {
                goTo(part.id);
                setOpenBreadcrumb(null);
              }}
            >
              <Home size={13} /> Open {part.name}
            </button>

            {childFolders.map(folder => (
              <button
                key={folder.id}
                className="breadcrumb-option"
                onClick={() => {
                  goTo(folder.id);
                  setOpenBreadcrumb(null);
                }}
              >
                <Folder size={13} />
                <span>{folder.name}</span>
              </button>
            ))}

            {childFolders.length === 0 && (
              <span className="breadcrumb-no-folders">No subfolders</span>
            )}
          </span>
        )}
      </span>
    </span>
  );
})}
        </div>

        <div className="address-search">
          <Search size={15} />
          <span>{search ? `Searching: ${search}` : `Search ${locationName}`}</span>
        </div>
      </div>

      <div className="command-bar">
        <button className="command-primary" onClick={() => { setDialog('new'); setInputName(''); }}>
          <Plus size={16} /> New <span className="command-chevron">⌄</span>
        </button>
        <div className="command-divider" />
        <button className="command-button" disabled={!selectedItem} onClick={() => { setDialog('rename'); setInputName(selectedItem?.name ?? ''); }}>
          <Pencil size={15} /><span>Rename</span>
        </button>
        <button className="command-button" disabled={!selectedItem} onClick={deleteSelected}>
          <Trash2 size={15} /><span>Delete</span>
        </button>
        <div className="command-divider" />
        <button className="command-button" onClick={() => { setSortBy('name'); setAscending(value => !value); }}>
          <SlidersHorizontal size={15} /><span>Sort</span>
        </button>
        <div className="command-spacer" />
        <button className={`command-button view-control ${view === 'details' ? 'selected' : ''}`} onClick={() => setView('details')} title="Details view"><List size={17} /><span>Details</span></button>
        <button className={`command-button view-control ${view === 'grid' ? 'selected' : ''}`} onClick={() => setView('grid')} title="Grid view"><LayoutGrid size={16} /><span>Icons</span></button>
        <button className={`icon-button ${showProperties ? 'property-active' : ''}`} onClick={() => setShowProperties(value => !value)} title="Toggle properties"><PanelRight size={17} /></button>
      </div>

      <div className={`explorer-workspace ${showProperties ? '' : 'no-properties'}`}>
        <section className="file-area">
          <div className="location-heading">
            <div>
              <h1>{search ? 'Search results' : locationName}</h1>
              <p>{search ? `Matches for “${search}”` : 'Browse your files and folders'}</p>
            </div>
            <button className="icon-button" title="More options" onClick={() => setNotice('More file actions will arrive with filesystem integration.')}><MoreHorizontal /></button>
          </div>

          {view === 'details' ? (
            <div className="details-view">
              <div className="file-table-header">
                <button className="name-column" onClick={() => { setSortBy('name'); setAscending(v => !v); }}>Name <span>↕</span></button>
                <button onClick={() => { setSortBy('modified'); setAscending(v => !v); }}>Date modified ↕</button>
                <button onClick={() => { setSortBy('type'); setAscending(v => !v); }}>Type ↕</button>
                <button onClick={() => { setSortBy('size'); setAscending(v => !v); }}>Size ↕</button>
              </div>
              <div className="file-rows">
                {visibleItems.map(item => (
                  <button
                    key={item.id}
                    className={`file-row ${selected === item.id ? 'file-row-selected' : ''}`}
                    onClick={() => setSelected(item.id)}
                    onDoubleClick={() => openItem(item)}
                    onContextMenu={event => { event.preventDefault(); setSelected(item.id); }}
                  >
                    <span className="name-cell">{fileIcon(item)}<span>{item.name}</span></span>
                    <span>{item.modified}</span>
                    <span>{item.type}</span>
                    <span>{formatSize(item.size)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="icon-grid">
              {visibleItems.map(item => (
                <button key={item.id} className={`grid-item ${selected === item.id ? 'grid-item-selected' : ''}`} onClick={() => setSelected(item.id)} onDoubleClick={() => openItem(item)}>
                  {fileIcon(item, 34)}
                  <span>{item.name}</span>
                  <small>{item.kind === 'folder' ? 'Folder' : formatSize(item.size)}</small>
                </button>
              ))}
            </div>
          )}

          {visibleItems.length === 0 && (
            <div className="empty-state">
              <Folder size={34} />
              <h3>{search ? 'No matching items' : 'This folder is empty'}</h3>
              <p>{search ? 'Try a different search term.' : 'Create a new folder to get started.'}</p>
              {!search && <button className="command-primary" onClick={() => { setDialog('new'); setInputName(''); }}><Plus size={15} /> New folder</button>}
            </div>
          )}

          <div className="status-bar">
            <span>{visibleItems.length} items</span>
            {selectedItem && <span>Selected: {selectedItem.name} · {formatSize(selectedItem.size)}</span>}
            <span className="status-mock"><span /> Mock data</span>
          </div>
        </section>

        {showProperties && (
          <aside className="properties-panel">
            <div className="properties-header">
              <span>Details</span>
              <button className="icon-button" onClick={() => setShowProperties(false)} aria-label="Close details"><X size={16} /></button>
            </div>
            {selectedItem ? (
              <div className="properties-content">
                <div className="property-icon">{fileIcon(selectedItem, 42)}</div>
                <h3>{selectedItem.name}</h3>
                <p className="property-subtitle">{selectedItem.type}</p>
                {isImageFile ? (
  <div className="quick-preview image-preview">
    <div className="preview-art">
      <span className="preview-sun" />
      <span className="preview-mountain preview-mountain-back" />
      <span className="preview-mountain preview-mountain-front" />
    </div>
    <span className="preview-caption">Image preview · Demo artwork</span>
  </div>
) : isTextFile ? (
  <div className="quick-preview text-preview">
    <div className="preview-caption">
      {selectedExtension === 'md' || selectedExtension === 'markdown'
        ? 'MARKDOWN PREVIEW'
        : 'TEXT PREVIEW'}
    </div>
    {selectedExtension === 'md' || selectedExtension === 'markdown' ? (
      <>
        <h4>Project notes</h4>
        <p>A quick overview of this file.</p>
        <div className="preview-line preview-line-long" />
        <div className="preview-line" />
        <h5>Next steps</h5>
        <div className="preview-line preview-line-long" />
      </>
    ) : (
      <>
        <p>These are sample contents for the selected text file.</p>
        <div className="preview-line preview-line-long" />
        <div className="preview-line" />
        <div className="preview-line preview-line-medium" />
      </>
    )}
  </div>
) : (
  <div className="quick-preview generic-preview">
    {fileIcon(selectedItem, 32)}
    <span>Preview isn't available for this file type yet.</span>
  </div>
)}
                <div className="property-rule" />
                <div className="property-row"><span>Type</span><span>{selectedItem.type}</span></div>
                <div className="property-row"><span>Size</span><span>{formatSize(selectedItem.size)}</span></div>
                <div className="property-row"><span>Modified</span><span>{selectedItem.modified}</span></div>
                <div className="property-row"><span>Location</span><span>{pathParts.map(p => p.name).join(' / ')}</span></div>
                <div className="property-tip"><HardDrive size={16} /><span>This is demo metadata. Your real files are untouched.</span></div>
              </div>
            ) : (
              <div className="properties-empty">
                <PanelRight size={29} />
                <p>Select a file or folder to see its details.</p>
              </div>
            )}
          </aside>
        )}
      </div>

      {notice && (
        <div className="toast" role="status">
          <Check size={16} /><span>{notice}</span>
          <button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button>
        </div>
      )}

      {dialog && (
        <div className="dialog-backdrop" onClick={() => setDialog(null)}>
          <form className="explorer-dialog" onSubmit={submitDialog} onClick={event => event.stopPropagation()}>
            <div className="dialog-heading">
              <h2>{dialog === 'new' ? 'Create new folder' : 'Rename item'}</h2>
              <button type="button" className="icon-button" onClick={() => setDialog(null)}><X size={17} /></button>
            </div>
            <p>{dialog === 'new' ? 'Add a folder to this mock directory.' : 'Enter a new name for this item.'}</p>
            <input autoFocus value={inputName} onChange={event => setInputName(event.target.value)} placeholder="Folder name" />
            <div className="dialog-actions">
              <button type="button" className="dialog-cancel" onClick={() => setDialog(null)}>Cancel</button>
              <button className="command-primary" type="submit">{dialog === 'new' ? 'Create folder' : 'Rename'}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
