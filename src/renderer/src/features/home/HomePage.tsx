import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';

import FileTypeIcon from '../../componenets/icons/FileTypeIcon';

import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RefreshCw,
  ChevronRight,
  Search,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Folder,
  MoreHorizontal,
  PanelRight,
  X,
  Pencil,
  Trash2,
  HardDrive,
  Home,
  Check,
  Star,
} from 'lucide-react';

import {
  initialItems,
  formatSize,
  type ExplorerItem,
} from '../../data/ExplorerData';

type ViewMode = 'details' | 'grid';

interface Props {
  search: string;
  page: string;
  onNavigate: (page: string) => void;
}

const folderPages: Record<string, string> = {
  Desktop: 'desktop',
  Downloads: 'downloads',
  Documents: 'documents',
  Pictures: 'pictures',
  Music: 'music',
  Videos: 'videos',
};

const imageExtensions = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'bmp',
  'svg',
];

function fileIcon(item: ExplorerItem, size = 19) {
  return (
    <FileTypeIcon
      name={item.name}
      kind={item.kind}
      size={size}
    />
  );
}

function getExtension(name: string) {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

function isImage(item: ExplorerItem) {
  return (
    item.kind === 'file' &&
    imageExtensions.includes(getExtension(item.name))
  );
}

export default function HomePage({
  search,
  page,
  onNavigate,
}: Props) {
  const [items, setItems] = useState<ExplorerItem[]>(initialItems);
  const [current, setCurrent] = useState('root');

  const [history, setHistory] = useState<string[]>(['root']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selected, setSelected] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [view, setView] = useState<ViewMode>('details');

  const [sortBy, setSortBy] = useState<
    'name' | 'modified' | 'type' | 'size'
  >('name');

  const [ascending, setAscending] = useState(true);
  const [showProperties, setShowProperties] = useState(true);

  const [dialog, setDialog] = useState<'new' | 'rename' | null>(null);
  const [inputName, setInputName] = useState('');
  const [notice, setNotice] = useState('');

  const [clipboard, setClipboard] = useState<{
    itemId: string;
    operation: 'copy' | 'cut';
  } | null>(null);

  const [undoStack, setUndoStack] = useState<{
    items: ExplorerItem[];
    favorites: string[];
  }[]>([]);

  function saveUndoSnapshot() {
    setUndoStack(previous => [
      ...previous,
      { items: [...items], favorites: [...favorites] },
    ].slice(-20));
  }

  function undoLastAction() {
    if (undoStack.length === 0) {
      setNotice('Nothing to undo.');
      return;
    }

    const snapshot = undoStack[undoStack.length - 1];
    setItems(snapshot.items);
    setFavorites(snapshot.favorites);
    setUndoStack(previous => previous.slice(0, -1));
    setSelected(null);
      setSelectedIds([]);
    setNotice('Last action undone.');
  }

  const [favorites, setFavorites] = useState<string[]>([
    'design',
    'resume',
  ]);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    itemId: string;
  } | null>(null);

  const selectedItem =
    items.find(item => item.id === selected) ?? null;

  function handleItemSelection(
    item: ExplorerItem,
    event: MouseEvent,
    index: number,
  ) {
    if (event.shiftKey && lastClickedIndex !== null) {
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      const rangeIds = visibleItems.slice(start, end + 1).map(entry => entry.id);
      setSelectedIds(rangeIds);
      setSelected(item.id);
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      const wasSelected = selectedIds.includes(item.id);
      const nextIds = wasSelected
        ? selectedIds.filter(id => id !== item.id)
        : [...selectedIds, item.id];

      setSelectedIds(nextIds);
      setSelected(wasSelected ? (nextIds[nextIds.length - 1] ?? null) : item.id);
      setLastClickedIndex(index);
      return;
    }

    setSelected(item.id);
    setSelectedIds([item.id]);
    setLastClickedIndex(index);
  }

  const selectedExtension = selectedItem
    ? getExtension(selectedItem.name)
    : '';

  const isImageFile = selectedItem
    ? isImage(selectedItem)
    : false;

  const isTextFile = [
    'txt',
    'md',
    'markdown',
  ].includes(selectedExtension);

  const currentFolder = items.find(
    item => item.id === current,
  );

  useEffect(() => {
    const destination = folderPages[page] ?? 'root';

    if (destination === current) return;

    setCurrent(destination);
    setSelected(null);
      setSelectedIds([]);

    setHistory(previous => [
      ...previous.slice(0, historyIndex + 1),
      destination,
    ]);

    setHistoryIndex(previous => previous + 1);
  }, [page]);

  function handleContextMenu(
    event: MouseEvent,
    item: ExplorerItem,
  ) {
    event.preventDefault();

    setSelected(item.id);
    setSelectedIds([item.id]);

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      itemId: item.id,
    });
  }

  function goTo(id: string) {
    if (id === current) return;

    setCurrent(id);
    setSelected(null);
      setSelectedIds([]);

    setHistory(previous => [
      ...previous.slice(0, historyIndex + 1),
      id,
    ]);

    setHistoryIndex(previous => previous + 1);
  }

  function goBack() {
    if (historyIndex <= 0) return;

    const nextIndex = historyIndex - 1;

    setHistoryIndex(nextIndex);
    setCurrent(history[nextIndex]);
    setSelected(null);
      setSelectedIds([]);
  }

  function goForward() {
    if (historyIndex >= history.length - 1) return;

    const nextIndex = historyIndex + 1;

    setHistoryIndex(nextIndex);
    setCurrent(history[nextIndex]);
    setSelected(null);
      setSelectedIds([]);
  }

  function goUp() {
    if (current === 'root') return;

    const parent =
      items.find(item => item.id === current)?.parent ?? 'root';

    goTo(parent);
  }

  function openItem(item: ExplorerItem) {
    if (item.kind === 'folder') {
      goTo(item.id);
    } else {
      setSelected(item.id);
      setSelectedIds([item.id]);

      setNotice(
        `"${item.name}" is a mock file. Real file opening will be available after filesystem integration.`,
      );
    }
  }

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result: ExplorerItem[];

    if (query) {
      result = items.filter(item =>
        item.name.toLowerCase().includes(query),
      );
    } else if (page === 'Gallery') {
      result = items.filter(isImage);
    } else if (page === 'Recent') {
      result = items.filter(item => item.kind === 'file');
    } else if (page === 'Favorites') {
      result = items.filter(item =>
        favorites.includes(item.id),
      );
    } else {
      result = items.filter(item => item.parent === current);
    }

    result = [...result].sort((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind === 'folder' ? -1 : 1;
      }

      let comparison = 0;

      if (sortBy === 'size') {
        comparison = a.size - b.size;
      } else if (sortBy === 'modified') {
        comparison = a.modified.localeCompare(b.modified);
      } else if (sortBy === 'type') {
        comparison = a.type.localeCompare(b.type);
      } else {
        comparison = a.name.localeCompare(b.name);
      }

      return ascending ? comparison : -comparison;
    });

    if (page === 'Recent' && !query) {
      result.reverse();
    }

    return result;
  }, [
    items,
    current,
    search,
    page,
    sortBy,
    ascending,
    favorites,
  ]);

  function submitDialog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = inputName.trim();

    if (!name) return;

    if (
      items.some(
        item =>
          item.parent === current &&
          item.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
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

      saveUndoSnapshot();
      setItems(previous => [...previous, newItem]);
      setSelected(newItem.id);
      setNotice(`Created mock folder "${name}".`);
    } else if (dialog === 'rename' && selectedItem) {
      saveUndoSnapshot();
      setItems(previous =>
        previous.map(item =>
          item.id === selectedItem.id
            ? {
                ...item,
                name,
                type:
                  item.kind === 'folder'
                    ? 'File folder'
                    : `${getExtension(name).toUpperCase()} File`,
                modified: 'Just now',
              }
            : item,
        ),
      );

      setNotice(`Renamed item to "${name}".`);
    }

    setDialog(null);
    setInputName('');
  }

  function deleteSelected() {
    if (!selectedItem) return;

    const idsToDelete = selectedIds.length ? selectedIds : [selectedItem.id];
    const selectedNames = items
      .filter(item => idsToDelete.includes(item.id))
      .map(item => item.name);

    if (!window.confirm(
      idsToDelete.length > 1
        ? `Remove ${idsToDelete.length} selected items from the mock filesystem?`
        : `Remove "${selectedNames[0] ?? selectedItem.name}" from the mock filesystem?`,
    )) return;

    const removeIds = new Set<string>(idsToDelete);
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

    saveUndoSnapshot();
    setItems(previous => previous.filter(item => !removeIds.has(item.id)));
    setFavorites(previous => previous.filter(id => !removeIds.has(id)));
    setSelected(null);
    setSelectedIds([]);
    setNotice(idsToDelete.length > 1 ? 'Removed selected items from mock data.' : 'Removed from mock data only.');
  }

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key === 'Escape') {
        setContextMenu(null);
        setSelected(null);
      setSelectedIds([]);
        setDialog(null);
        return;
      }

      if (event.ctrlKey && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        undoLastAction();
        return;
      }

      if (event.ctrlKey && event.key.toLowerCase() === 'v') {
        event.preventDefault();

        if (!clipboard) {
          setNotice('Clipboard is empty.');
          return;
        }

        const source = items.find(
          item => item.id === clipboard.itemId,
        );

        if (!source) {
          setNotice('Clipboard item no longer exists.');
          setClipboard(null);
          return;
        }

        if (source.id === current) {
          setNotice('Cannot paste a folder into itself.');
          return;
        }

        // Prevent moving/copying a folder into itself or one of its descendants.
        let destinationParent: string | undefined = current;
        while (destinationParent && destinationParent !== 'root') {
          if (destinationParent === source.id) {
            setNotice('Cannot paste a folder inside itself.');
            return;
          }

          destinationParent = items.find(
            item => item.id === destinationParent,
          )?.parent;
        }

        if (
          items.some(
            item =>
              item.parent === current &&
              item.name.toLowerCase() === source.name.toLowerCase() &&
              item.id !== source.id,
          )
        ) {
          setNotice('An item with this name already exists.');
          return;
        }

        if (clipboard.operation === 'copy') {
          const copiedItem: ExplorerItem = {
            ...source,
            id: `copy-${Date.now()}`,
            parent: current,
            modified: 'Just now',
          };

          saveUndoSnapshot();
          setItems(previous => [...previous, copiedItem]);
          setSelected(copiedItem.id);
          setNotice(`Copied "${source.name}" here.`);
        } else {
          if (source.parent === current) {
            setNotice('This item is already in this folder.');
            return;
          }

          saveUndoSnapshot();
          setItems(previous =>
            previous.map(item =>
              item.id === source.id
                ? {
                    ...item,
                    parent: current,
                    modified: 'Just now',
                  }
                : item,
            ),
          );

          setSelected(source.id);
          setClipboard(null);
          setNotice(`Moved "${source.name}" here.`);
        }
      }

      if (!selectedItem) return;

      if (event.key === 'F2') {
        event.preventDefault();
        setInputName(selectedItem.name);
        setDialog('rename');
        setContextMenu(null);
        return;
      }

      if (event.key === 'Delete') {
        event.preventDefault();
        deleteSelected();
        setContextMenu(null);
        return;
      }

      if (event.ctrlKey && event.key.toLowerCase() === 'c') {
        event.preventDefault();

        setClipboard({
          itemId: selectedItem.id,
          operation: 'copy',
        });

        setNotice(`Copied "${selectedItem.name}".`);
        return;
      }

      if (event.ctrlKey && event.key.toLowerCase() === 'x') {
        event.preventDefault();

        setClipboard({
          itemId: selectedItem.id,
          operation: 'cut',
        });

        setNotice(`Cut "${selectedItem.name}".`);
        return;
      }


    }

    window.addEventListener('keydown', handleKeyboard);

    return () => {
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [selectedItem, clipboard, items, current, favorites, undoStack]);

  function toggleFavorite() {
    if (!selectedItem) return;

    if (favorites.includes(selectedItem.id)) {
      saveUndoSnapshot();
      setFavorites(previous =>
        previous.filter(id => id !== selectedItem.id),
      );

      setNotice('Removed from Favorites.');
    } else {
      saveUndoSnapshot();
      setFavorites(previous => [
        ...previous,
        selectedItem.id,
      ]);

      setNotice('Added to Favorites.');
    }
  }

  function deleteContextItem() {
    if (!contextMenu) return;

    const item = items.find(
      entry => entry.id === contextMenu.itemId,
    );

    setContextMenu(null);

    if (!item) return;

    if (!window.confirm(`Delete "${item.name}" from mock data?`)) {
      return;
    }

    const removeIds = new Set<string>([item.id]);

    let changed = true;

    while (changed) {
      changed = false;

      items.forEach(entry => {
        if (
          removeIds.has(entry.parent) &&
          !removeIds.has(entry.id)
        ) {
          removeIds.add(entry.id);
          changed = true;
        }
      });
    }

    saveUndoSnapshot();
    setItems(previous =>
      previous.filter(entry => !removeIds.has(entry.id)),
    );

    setFavorites(previous =>
      previous.filter(id => !removeIds.has(id)),
    );

    setSelected(null);
      setSelectedIds([]);
    setNotice('Removed from mock data only.');
  }

  const pathParts =
    current === 'root'
      ? [{ id: 'root', name: page === 'This PC' ? 'This PC' : 'Home' }]
      : (() => {
          const result: { id: string; name: string }[] = [];

          let cursor: string | undefined = current;

          while (cursor && cursor !== 'root') {
            const item = items.find(entry => entry.id === cursor);

            if (!item) break;

            result.unshift({
              id: item.id,
              name: item.name,
            });

            cursor = item.parent;
          }

          return [
            { id: 'root', name: 'Home' },
            ...result,
          ];
        })();

  const locationName =
    current === 'root'
      ? page
      : currentFolder?.name ?? 'Home';

  return (
    <main
      className="explorer-page"
      onClick={() => {
        if (contextMenu) setContextMenu(null);
      }}
    >
      <div className="explorer-navigation">
        <div className="nav-history">
          <button
            className="icon-button"
            onClick={goBack}
            disabled={historyIndex === 0}
            title="Back"
          >
            <ArrowLeft />
          </button>

          <button
            className="icon-button"
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            title="Forward"
          >
            <ArrowRight />
          </button>

          <button
            className="icon-button"
            onClick={goUp}
            disabled={current === 'root'}
            title="Up"
          >
            <ArrowUp />
          </button>

          <button
            className="icon-button"
            onClick={() => setNotice('View refreshed.')}
            title="Refresh"
          >
            <RefreshCw />
          </button>
        </div>

        <div className="address-bar">
          <Home size={15} className="address-home" />

          {pathParts.map((part, index) => (
            <span className="breadcrumb" key={part.id}>
              {index > 0 && <ChevronRight size={13} />}

              <button
                onClick={() => {
                  if (part.id === 'root') {
                    onNavigate('Home');
                  }

                  goTo(part.id);
                }}
              >
                {part.name}
              </button>
            </span>
          ))}
        </div>

        <div className="address-search">
          <Search size={15} />
          <span>
            {search
              ? `Searching: ${search}`
              : `Search ${locationName}`}
          </span>
        </div>
      </div>

      <div className="command-bar">
        <button
          className="command-primary"
          onClick={() => {
            setDialog('new');
            setInputName('');
          }}
        >
          <Plus size={16} />
          New
          <span className="command-chevron">⌄</span>
        </button>

        <div className="command-divider" />

        <button
          className="command-button"
          disabled={!selectedItem}
          onClick={() => {
            setDialog('rename');
            setInputName(selectedItem?.name ?? '');
          }}
        >
          <Pencil size={15} />
          <span>Rename</span>
        </button>

        <button
          className="command-button"
          disabled={!selectedItem}
          onClick={deleteSelected}
        >
          <Trash2 size={15} />
          <span>Delete</span>
        </button>

        <button
          className="command-button"
          disabled={!selectedItem}
          onClick={toggleFavorite}
        >
          <Star size={15} />
          <span>
            {selectedItem && favorites.includes(selectedItem.id)
              ? 'Unfavorite'
              : 'Favorite'}
          </span>
        </button>

        <div className="command-divider" />

        <button
          className="command-button"
          onClick={() => {
            setSortBy('name');
            setAscending(value => !value);
          }}
        >
          <SlidersHorizontal size={15} />
          <span>Sort</span>
        </button>

        <div className="command-spacer" />

        <button
          className={`command-button view-control ${
            view === 'details' ? 'selected' : ''
          }`}
          onClick={() => setView('details')}
          title="Details view"
        >
          <List size={17} />
          <span>Details</span>
        </button>

        <button
          className={`command-button view-control ${
            view === 'grid' ? 'selected' : ''
          }`}
          onClick={() => setView('grid')}
          title="Grid view"
        >
          <LayoutGrid size={16} />
          <span>Icons</span>
        </button>

        <button
          className={`icon-button ${
            showProperties ? 'property-active' : ''
          }`}
          onClick={() => setShowProperties(value => !value)}
          title="Toggle properties"
        >
          <PanelRight size={17} />
        </button>
      </div>

      <div
        className={`explorer-workspace ${
          showProperties ? '' : 'no-properties'
        }`}
      >
        <section className="file-area">
          <div className="location-heading">
            <div>
              <h1>
                {search
                  ? 'Search results'
                  : page === 'Gallery'
                    ? 'Gallery'
                    : page === 'Recent'
                      ? 'Recent'
                      : page === 'Favorites'
                        ? 'Favorites'
                        : locationName}
              </h1>

              <p>
                {search
                  ? `Matches for "${search}"`
                  : page === 'Gallery'
                    ? 'Browse your images'
                    : page === 'Recent'
                      ? 'Recently modified files'
                      : page === 'Favorites'
                        ? 'Your favorite files and folders'
                        : 'Browse your files and folders'}
              </p>
            </div>

            <button
              className="icon-button"
              title="More options"
              onClick={() => setNotice('More options coming soon.')}
            >
              <MoreHorizontal />
            </button>
          </div>

          {view === 'details' ? (
            <div className="details-view">
              <div className="file-table-header">
                <button
                  className="name-column"
                  onClick={() => {
                    setSortBy('name');
                    setAscending(value => !value);
                  }}
                >
                  Name ↕
                </button>

                <button
                  onClick={() => {
                    setSortBy('modified');
                    setAscending(value => !value);
                  }}
                >
                  Date modified ↕
                </button>

                <button
                  onClick={() => {
                    setSortBy('type');
                    setAscending(value => !value);
                  }}
                >
                  Type ↕
                </button>

                <button
                  onClick={() => {
                    setSortBy('size');
                    setAscending(value => !value);
                  }}
                >
                  Size ↕
                </button>
              </div>

              <div className="file-rows">
                {visibleItems.map(item => (
                  <button
                    key={item.id}
                    className={`file-row ${
                      selectedIds.includes(item.id) || selected === item.id
                        ? 'file-row-selected'
                        : ''
                    }`}
                    onClick={event =>
                      handleItemSelection(item, event, visibleItems.findIndex(entry => entry.id === item.id))
                    }
                    onDoubleClick={() => openItem(item)}
                    onContextMenu={event =>
                      handleContextMenu(event, item)
                    }
                  >
                    <span className="name-cell">
                      {fileIcon(item)}
                      <span>{item.name}</span>
                    </span>

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
                <button
                  key={item.id}
                  className={`grid-item ${
                    selectedIds.includes(item.id) || selected === item.id
                      ? 'grid-item-selected'
                      : ''
                  }`}
                  onClick={event =>
                    handleItemSelection(item, event, visibleItems.findIndex(entry => entry.id === item.id))
                  }
                  onDoubleClick={() => openItem(item)}
                  onContextMenu={event =>
                    handleContextMenu(event, item)
                  }
                >
                  {fileIcon(item, 34)}

                  <span>{item.name}</span>

                  <small>
                    {item.kind === 'folder'
                      ? 'Folder'
                      : formatSize(item.size)}
                  </small>
                </button>
              ))}
            </div>
          )}

          {visibleItems.length === 0 && (
            <div className="empty-state">
              <Folder size={34} />

              <h3>
                {search ? 'No matching items' : 'This folder is empty'}
              </h3>

              <p>
                {search
                  ? 'Try a different search term.'
                  : 'Create a new folder to get started.'}
              </p>

              {!search && (
                <button
                  className="command-primary"
                  onClick={() => {
                    setDialog('new');
                    setInputName('');
                  }}
                >
                  <Plus size={15} />
                  New folder
                </button>
              )}
            </div>
          )}

          <div className="status-bar">
            <span>{visibleItems.length} items</span>

            {selectedItem && (
              <span>
                {selectedIds.length > 1
                  ? `${selectedIds.length} items selected`
                  : `Selected: ${selectedItem.name} · ${formatSize(selectedItem.size)}`}
              </span>
            )}

            {clipboard && (
              <span>
                Clipboard: {clipboard.operation === 'cut' ? 'Cut' : 'Copied'}
              </span>
            )}

            {undoStack.length > 0 && <span>Ctrl+Z: Undo available</span>}

            <span className="status-mock">
              <span />
              Mock data
            </span>
          </div>
        </section>

        {showProperties && (
          <aside className="properties-panel">
            <div className="properties-header">
              <span>Details</span>

              <button
                className="icon-button"
                onClick={() => setShowProperties(false)}
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            </div>

            {selectedItem ? (
              <div className="properties-content">
                <div className="property-icon">
                  {fileIcon(selectedItem, 42)}
                </div>

                <h3>{selectedItem.name}</h3>

                <p className="property-subtitle">
                  {selectedItem.type}
                </p>

                {isImageFile ? (
                  <div className="quick-preview image-preview">
                    <div className="preview-art">
                      <span className="preview-sun" />
                      <span className="preview-mountain preview-mountain-back" />
                      <span className="preview-mountain preview-mountain-front" />
                    </div>

                    <span className="preview-caption">
                      Image preview · Demo artwork
                    </span>
                  </div>
                ) : isTextFile ? (
                  <div className="quick-preview text-preview">
                    <div className="preview-caption">
                      TEXT PREVIEW
                    </div>

                    <p>
                      These are sample contents for this text file.
                    </p>

                    <div className="preview-line preview-line-long" />
                    <div className="preview-line" />
                  </div>
                ) : (
                  <div className="quick-preview generic-preview">
                    {fileIcon(selectedItem, 32)}

                    <span>
                      Preview isn't available for this file type yet.
                    </span>
                  </div>
                )}

                <div className="property-rule" />

                <div className="property-row">
                  <span>Type</span>
                  <span>{selectedItem.type}</span>
                </div>

                <div className="property-row">
                  <span>Size</span>
                  <span>{formatSize(selectedItem.size)}</span>
                </div>

                <div className="property-row">
                  <span>Modified</span>
                  <span>{selectedItem.modified}</span>
                </div>

                <div className="property-row">
                  <span>Location</span>
                  <span>
                    {pathParts.map(p => p.name).join(' / ')}
                  </span>
                </div>

                <div className="property-tip">
                  <HardDrive size={16} />

                  <span>
                    This is demo metadata. Your real files are untouched.
                  </span>
                </div>
              </div>
            ) : (
              <div className="properties-empty">
                <PanelRight size={29} />

                <p>
                  Select a file or folder to see its details.
                </p>
              </div>
            )}
          </aside>
        )}
      </div>

      {notice && (
        <div className="toast" role="status">
          <Check size={16} />

          <span>{notice}</span>

          <button
            onClick={() => setNotice('')}
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {dialog && (
        <div
          className="dialog-backdrop"
          onClick={() => setDialog(null)}
        >
          <form
            className="explorer-dialog"
            onSubmit={submitDialog}
            onClick={event => event.stopPropagation()}
          >
            <div className="dialog-heading">
              <h2>
                {dialog === 'new'
                  ? 'Create new folder'
                  : 'Rename item'}
              </h2>

              <button
                type="button"
                className="icon-button"
                onClick={() => setDialog(null)}
              >
                <X size={17} />
              </button>
            </div>

            <p>
              {dialog === 'new'
                ? 'Add a folder to this mock directory.'
                : 'Enter a new name for this item.'}
            </p>

            <input
              autoFocus
              value={inputName}
              onChange={event => setInputName(event.target.value)}
              placeholder="Folder name"
            />

            <div className="dialog-actions">
              <button
                type="button"
                className="dialog-cancel"
                onClick={() => setDialog(null)}
              >
                Cancel
              </button>

              <button
                className="command-primary"
                type="submit"
              >
                {dialog === 'new' ? 'Create folder' : 'Rename'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Context menu */}

      {contextMenu && (
        <>
          <div
            className="context-menu-backdrop"
            onClick={() => setContextMenu(null)}
            onContextMenu={event => {
              event.preventDefault();
              setContextMenu(null);
            }}
          />

          <div
            className="context-menu"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
            onClick={event => event.stopPropagation()}
          >
            <button
              onClick={() => {
                const item = items.find(
                  entry => entry.id === contextMenu.itemId,
                );

                if (item) openItem(item);

                setContextMenu(null);
              }}
            >
              <Folder size={15} />
              Open
            </button>

            <button
              onClick={() => {
                const item = items.find(
                  entry => entry.id === contextMenu.itemId,
                );

                setSelected(contextMenu.itemId);
                setInputName(item?.name ?? '');
                setDialog('rename');
                setContextMenu(null);
              }}
            >
              <Pencil size={15} />
              Rename
            </button>

            <button
              onClick={() => {
                const id = contextMenu.itemId;

                saveUndoSnapshot();
                setFavorites(previous =>
                  previous.includes(id)
                    ? previous.filter(favoriteId => favoriteId !== id)
                    : [...previous, id],
                );

                setSelected(id);
                setContextMenu(null);
                setNotice('Favorite updated.');
              }}
            >
              <Star size={15} />
              Toggle Favorite
            </button>

            <div className="context-menu-divider" />

            <button
              className="context-menu-danger"
              onClick={deleteContextItem}
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </>
      )}
    </main>
  );
}