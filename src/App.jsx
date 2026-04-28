import { useEffect, useCallback } from 'react';
import { Toolbar } from './components/Toolbar';
import { TabBar } from './components/TabBar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Settings } from './components/Settings';
import { useApp } from './context/AppContext';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

function App() {
  const { settings, activeTab, activeTabId, addTab, markTabSaved } = useApp();

  const handleKeyDown = useCallback(async (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          addTab();
          break;
        case 'o':
          e.preventDefault();
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
          } catch (err) { console.error(err); }
          break;
        case 's':
          e.preventDefault();
          if (activeTab) {
            try {
              if (activeTab.filePath) {
                await writeTextFile(activeTab.filePath, activeTab.content);
                markTabSaved(activeTabId, activeTab.filePath);
              } else {
                const filePath = await save({
                  filters: [{ name: 'Markdown', extensions: ['md'] }],
                  defaultPath: activeTab.title,
                });
                if (filePath) {
                  await writeTextFile(filePath, activeTab.content);
                  const name = filePath.split(/[\\/]/).pop();
                  markTabSaved(activeTabId, filePath, name);
                }
              }
            } catch (err) { console.error(err); }
          }
          break;
      }
    }
  }, [activeTab, activeTabId, addTab, markTabSaved]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="app">
      <Toolbar />
      <TabBar />
      <div className={`main-content view-${settings.viewMode}`}>
        {(settings.viewMode === 'split' || settings.viewMode === 'editor') && (
          <div className="pane editor-pane"><Editor /></div>
        )}
        {settings.viewMode === 'split' && <div className="pane-divider" />}
        {(settings.viewMode === 'split' || settings.viewMode === 'preview') && (
          <div className="pane preview-pane"><Preview /></div>
        )}
      </div>
      <div className="statusbar">
        <span className="statusbar-item">{activeTab?.filePath || 'Unsaved'}</span>
        <span className="statusbar-item">{activeTab?.content ? activeTab.content.split('\n').length : 0} lines</span>
        <span className="statusbar-item">{activeTab?.content ? activeTab.content.length : 0} chars</span>
      </div>
      <Settings />
    </div>
  );
}

export default App;
