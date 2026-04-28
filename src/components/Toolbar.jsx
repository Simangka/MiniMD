import { useApp } from '../context/AppContext';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

export function Toolbar() {
  const {
    theme, toggleTheme, activeTab, activeTabId,
    addTab, markTabSaved, setShowSettings,
    settings, updateSettings, setSearchOpen, searchOpen
  } = useApp();

  const handleNew = () => {
    addTab();
  };

  const handleOpen = async () => {
    try {
      const filePath = await open({
        multiple: false,
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown', 'mdx', 'txt'] }],
      });
      if (filePath) {
        const content = await readTextFile(filePath);
        const name = filePath.split(/[\\/]/).pop();
        addTab(name, content, filePath);
      }
    } catch (e) {
      console.error('Failed to open file:', e);
    }
  };

  const handleSave = async () => {
    if (!activeTab) return;
    try {
      if (activeTab.filePath) {
        await writeTextFile(activeTab.filePath, activeTab.content);
        markTabSaved(activeTabId, activeTab.filePath);
      } else {
        await handleSaveAs();
      }
    } catch (e) {
      console.error('Failed to save file:', e);
    }
  };

  const handleSaveAs = async () => {
    if (!activeTab) return;
    try {
      const filePath = await save({
        filters: [{ name: 'Markdown', extensions: ['md'] }],
        defaultPath: activeTab.title,
      });
      if (filePath) {
        await writeTextFile(filePath, activeTab.content);
        const name = filePath.split(/[\\/]/).pop();
        markTabSaved(activeTabId, filePath, name);
      }
    } catch (e) {
      console.error('Failed to save file:', e);
    }
  };

  const cycleView = () => {
    const modes = ['split', 'editor', 'preview'];
    const idx = modes.indexOf(settings.viewMode);
    updateSettings({ viewMode: modes[(idx + 1) % modes.length] });
  };

  const viewIcon = {
    split: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="2" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    editor: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 5h6M5 8h4M5 11h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    preview: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  };

  return (
    <div className="toolbar" data-tauri-drag-region>
      <div className="toolbar-left">
        <span className="toolbar-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm14 0l3.5 7L14 21l3.5-7z" 
              fill="currentColor" opacity="0.8"/>
          </svg>
          MinimalMD
        </span>
        <div className="toolbar-divider" />
        <button className="toolbar-btn" onClick={handleNew} title="New File (Ctrl+N)">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="toolbar-btn" onClick={handleOpen} title="Open File (Ctrl+O)">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M2 13V5a1 1 0 011-1h3l2 2h5a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1z" 
              stroke="currentColor" strokeWidth="1.4"/>
          </svg>
        </button>
        <button className="toolbar-btn" onClick={handleSave} title="Save (Ctrl+S)">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M12.5 14H3.5a1 1 0 01-1-1V3a1 1 0 011-1h7l3 3v8a1 1 0 01-1 1z" 
              stroke="currentColor" strokeWidth="1.4"/>
            <path d="M5.5 14V9h5v5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M5.5 2v3h4" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
      </div>

      <div className="toolbar-center">
        <button className="toolbar-btn view-btn" onClick={cycleView} title={`View: ${settings.viewMode}`}>
          {viewIcon[settings.viewMode]}
          <span className="view-label">{settings.viewMode}</span>
        </button>
      </div>

      <div className="toolbar-right">
        <button 
          className="toolbar-btn" 
          onClick={() => setSearchOpen(!searchOpen)} 
          title="Search (Ctrl+F)"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="toolbar-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" 
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 9.5a6 6 0 01-7-7 6 6 0 107 7z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          )}
        </button>
        <button className="toolbar-btn" onClick={() => setShowSettings(true)} title="Settings">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3" 
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
