import { useState, type ReactNode, isValidElement, cloneElement } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface Props {
  children: ReactNode;
  search: string;
  onSearchChange: (value: string) => void;
}

type ExplorerTab = {
  id: number;
  title: string;
  search: string;
};

export default function AppLayout({
  children,
  search,
  onSearchChange,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nextId, setNextId] = useState(2);
  const [tabs, setTabs] = useState<ExplorerTab[]>([
    { id: 1, title: 'Home', search: '' },
  ]);
  const [activeTab, setActiveTab] = useState(1);

  const active = tabs.find(tab => tab.id === activeTab) ?? tabs[0];

  function updateSearch(value: string) {
    setTabs(previous =>
      previous.map(tab =>
        tab.id === activeTab ? { ...tab, search: value } : tab,
      ),
    );
    onSearchChange(value);
  }

  function addTab() {
    const id = nextId;
    setNextId(value => value + 1);
    setTabs(previous => [
      ...previous,
      { id, title: 'Home', search: '' },
    ]);
    setActiveTab(id);
    onSearchChange('');
    setSidebarOpen(false);
  }

  function closeTab(id: number) {
    if (tabs.length === 1) {
      setTabs([{ id, title: 'Home', search: '' }]);
      setActiveTab(id);
      onSearchChange('');
      return;
    }

    const remaining = tabs.filter(tab => tab.id !== id);
    setTabs(remaining);

    if (activeTab === id) {
      const next = remaining[remaining.length - 1];
      setActiveTab(next.id);
      onSearchChange(next.search);
    }
  }

  function switchTab(id: number) {
    const tab = tabs.find(item => item.id === id);
    if (!tab) return;
    setActiveTab(id);
    onSearchChange(tab.search);
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      <div className="main-area">
        <Topbar
          search={active?.search ?? search}
          onSearchChange={updateSearch}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="explorer-tabs" role="tablist" aria-label="Explorer tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`explorer-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => switchTab(tab.id)}
            >
              <span className="explorer-tab-dot" />
              <span className="explorer-tab-title">{tab.title}</span>
              <span
                className="explorer-tab-close"
                role="button"
                aria-label={`Close ${tab.title} tab`}
                onClick={event => {
                  event.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                ×
              </span>
            </button>
          ))}
          <button className="explorer-tab-add" onClick={addTab} title="New tab" aria-label="New tab">
            +
          </button>
        </div>

        <div className="tab-content-stack">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className="tab-content"
              hidden={activeTab !== tab.id}
            >
              {isValidElement(children)
                ? cloneElement(
                    children as React.ReactElement<{ search: string }>,
                    { search: tab.search },
                  )
                : children}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
