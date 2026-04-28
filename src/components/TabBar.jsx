import { useApp } from '../context/AppContext';

export function TabBar() {
  const { tabs, activeTabId, setActiveTabId, closeTab } = useApp();

  const handleMiddleClick = (e, tabId) => {
    if (e.button === 1) {
      e.preventDefault();
      closeTab(tabId);
    }
  };

  return (
    <div className="tabbar">
      <div className="tabbar-scroll">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? 'tab-active' : ''}`}
            onClick={() => setActiveTabId(tab.id)}
            onMouseDown={(e) => handleMiddleClick(e, tab.id)}
          >
            <span className="tab-icon">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 2h8l2.5 3V13a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" 
                  stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
              </svg>
            </span>
            <span className="tab-title">
              {tab.title}
              {tab.isModified && <span className="tab-dot" />}
            </span>
            <button
              className="tab-close"
              onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
              title="Close tab"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
