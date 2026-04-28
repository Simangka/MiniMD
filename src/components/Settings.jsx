import { useApp } from '../context/AppContext';

export function Settings() {
  const { showSettings, setShowSettings, settings, updateSettings } = useApp();

  if (!showSettings) return null;

  return (
    <div className="settings-overlay" onClick={() => setShowSettings(false)}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close" onClick={() => setShowSettings(false)}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="settings-body">
          <div className="settings-section">
            <h3>Editor</h3>

            <div className="setting-row">
              <label>Font Size</label>
              <div className="setting-control">
                <button onClick={() => updateSettings({ fontSize: Math.max(10, settings.fontSize - 1) })}>−</button>
                <span className="setting-value">{settings.fontSize}px</span>
                <button onClick={() => updateSettings({ fontSize: Math.min(28, settings.fontSize + 1) })}>+</button>
              </div>
            </div>

            <div className="setting-row">
              <label>Tab Size</label>
              <div className="setting-control">
                <select 
                  value={settings.tabSize} 
                  onChange={e => updateSettings({ tabSize: Number(e.target.value) })}
                >
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                </select>
              </div>
            </div>

            <div className="setting-row">
              <label>Line Wrapping</label>
              <div className="setting-control">
                <button 
                  className={`toggle ${settings.lineWrapping ? 'toggle-on' : ''}`}
                  onClick={() => updateSettings({ lineWrapping: !settings.lineWrapping })}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>
            </div>

            <div className="setting-row">
              <label>Line Numbers</label>
              <div className="setting-control">
                <button 
                  className={`toggle ${settings.lineNumbers ? 'toggle-on' : ''}`}
                  onClick={() => updateSettings({ lineNumbers: !settings.lineNumbers })}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>
            </div>

            <div className="setting-row">
              <label>Font</label>
              <div className="setting-control">
                <select 
                  value={settings.fontFamily} 
                  onChange={e => updateSettings({ fontFamily: e.target.value })}
                >
                  <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                  <option value="'Fira Code', monospace">Fira Code</option>
                  <option value="'Cascadia Code', monospace">Cascadia Code</option>
                  <option value="'Consolas', monospace">Consolas</option>
                  <option value="monospace">System Mono</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Preview</h3>

            <div className="setting-row">
              <label>Preview Font Size</label>
              <div className="setting-control">
                <button onClick={() => updateSettings({ previewFontSize: Math.max(12, settings.previewFontSize - 1) })}>−</button>
                <span className="setting-value">{settings.previewFontSize}px</span>
                <button onClick={() => updateSettings({ previewFontSize: Math.min(24, settings.previewFontSize + 1) })}>+</button>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>View</h3>
            <div className="setting-row">
              <label>Default View</label>
              <div className="setting-control">
                <select 
                  value={settings.viewMode} 
                  onChange={e => updateSettings({ viewMode: e.target.value })}
                >
                  <option value="split">Split</option>
                  <option value="editor">Editor Only</option>
                  <option value="preview">Preview Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <span className="settings-hint">Changes are saved automatically</span>
        </div>
      </div>
    </div>
  );
}
