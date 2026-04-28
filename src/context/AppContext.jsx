import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const AppContext = createContext(null);

let tabIdCounter = 1;

function createTab(title = 'Untitled.md', content = '', filePath = null) {
  return {
    id: tabIdCounter++,
    title,
    filePath,
    content,
    isModified: false,
    scrollPos: 0,
  };
}

const DEFAULT_SETTINGS = {
  fontSize: 15,
  fontFamily: "'JetBrains Mono', monospace",
  previewFontSize: 16,
  lineWrapping: true,
  lineNumbers: true,
  viewMode: 'split', // 'editor', 'preview', 'split'
  autoSave: false,
  tabSize: 2,
};

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('minimalmd-theme') || 'dark';
  });
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('minimalmd-settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });
  const [tabs, setTabs] = useState([createTab()]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const editorRef = useRef(null);

  // Persist theme
  useEffect(() => {
    localStorage.setItem('minimalmd-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('minimalmd-settings', JSON.stringify(settings));
  }, [settings]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const updateTabContent = useCallback((tabId, content) => {
    setTabs(prev => prev.map(t =>
      t.id === tabId ? { ...t, content, isModified: true } : t
    ));
  }, []);

  const addTab = useCallback((title = 'Untitled.md', content = '', filePath = null) => {
    const newTab = createTab(title, content, filePath);
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    return newTab.id;
  }, []);

  const closeTab = useCallback((tabId) => {
    setTabs(prev => {
      if (prev.length === 1) {
        // Don't close the last tab, reset it instead
        const fresh = createTab();
        setActiveTabId(fresh.id);
        return [fresh];
      }
      const idx = prev.findIndex(t => t.id === tabId);
      const filtered = prev.filter(t => t.id !== tabId);
      if (activeTabId === tabId) {
        const newIdx = Math.min(idx, filtered.length - 1);
        setActiveTabId(filtered[newIdx].id);
      }
      return filtered;
    });
  }, [activeTabId]);

  const markTabSaved = useCallback((tabId, filePath, title) => {
    setTabs(prev => prev.map(t =>
      t.id === tabId ? { ...t, isModified: false, filePath, title: title || t.title } : t
    ));
  }, []);

  const updateSettings = useCallback((partial) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const value = {
    theme, toggleTheme,
    settings, updateSettings,
    tabs, activeTabId, activeTab,
    setActiveTabId, addTab, closeTab,
    updateTabContent, markTabSaved,
    showSettings, setShowSettings,
    searchOpen, setSearchOpen,
    editorRef,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
