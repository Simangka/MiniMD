import { useCallback, useEffect, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { search, openSearchPanel } from '@codemirror/search';
import { EditorView } from '@codemirror/view';
import { useApp } from '../context/AppContext';

// Custom minimal dark theme
const minimalDark = EditorView.theme({
  '&': {
    backgroundColor: 'var(--editor-bg)',
    color: 'var(--editor-text)',
    fontSize: 'var(--editor-font-size)',
    fontFamily: 'var(--editor-font)',
    height: '100%',
  },
  '.cm-content': {
    caretColor: 'var(--accent)',
    padding: '16px 0',
    fontFamily: 'var(--editor-font)',
  },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--accent)' },
  '&.cm-focused .cm-cursor': { borderLeftColor: 'var(--accent)' },
  '.cm-activeLine': { backgroundColor: 'var(--editor-active-line)' },
  '.cm-selectionBackground, ::selection': { backgroundColor: 'var(--editor-selection) !important' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: 'var(--editor-selection) !important' },
  '.cm-gutters': {
    backgroundColor: 'var(--editor-bg)',
    color: 'var(--editor-gutter)',
    border: 'none',
    paddingRight: '8px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 16px',
    minWidth: '3ch',
    fontSize: '0.85em',
    opacity: 0.5,
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'var(--surface-2)',
    border: 'none',
    color: 'var(--text-secondary)',
  },
  // Search panel styling
  '.cm-panels': {
    backgroundColor: 'var(--surface-1)',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-primary)',
  },
  '.cm-searchMatch': {
    backgroundColor: 'var(--search-match)',
    borderRadius: '2px',
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: 'var(--search-match-active)',
  },
  '.cm-panel.cm-search': {
    padding: '8px 12px',
  },
  '.cm-panel.cm-search input': {
    backgroundColor: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    color: 'var(--text-primary)',
    padding: '4px 8px',
    fontSize: '13px',
    outline: 'none',
  },
  '.cm-panel.cm-search input:focus': {
    borderColor: 'var(--accent)',
  },
  '.cm-panel.cm-search button': {
    backgroundColor: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    color: 'var(--text-primary)',
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  '.cm-panel.cm-search button:hover': {
    backgroundColor: 'var(--surface-3)',
  },
  '.cm-panel.cm-search label': {
    color: 'var(--text-secondary)',
    fontSize: '12px',
  },
  '.cm-tooltip': {
    backgroundColor: 'var(--surface-1)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
  },
  // Markdown-specific syntax colors
  '.cm-header': { color: 'var(--md-heading)', fontWeight: '600' },
  '.cm-strong': { color: 'var(--md-bold)', fontWeight: '700' },
  '.cm-em': { color: 'var(--md-italic)', fontStyle: 'italic' },
  '.cm-link': { color: 'var(--md-link)', textDecoration: 'underline' },
  '.cm-url': { color: 'var(--md-link)', opacity: 0.7 },
  '.cm-quote': { color: 'var(--md-quote)', fontStyle: 'italic' },
  '.cm-strikethrough': { textDecoration: 'line-through', color: 'var(--text-secondary)' },
  '.cm-formatting': { color: 'var(--text-muted)', opacity: 0.5 },
}, { dark: true });

const lineWrapping = EditorView.lineWrapping;

export function Editor() {
  const { activeTab, activeTabId, updateTabContent, settings, editorRef, searchOpen, setSearchOpen } = useApp();

  const extensions = useMemo(() => {
    const exts = [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      search({ top: true }),
      minimalDark,
    ];
    if (settings.lineWrapping) exts.push(lineWrapping);
    return exts;
  }, [settings.lineWrapping]);

  const onChange = useCallback((value) => {
    updateTabContent(activeTabId, value);
  }, [activeTabId, updateTabContent]);

  // Handle Ctrl+F to open CM search panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        // Open CodeMirror's search panel if editor is visible
        if (editorRef.current?.view) {
          openSearchPanel(editorRef.current.view);
        }
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorRef, setSearchOpen]);

  return (
    <div className="editor-container" style={{
      '--editor-font-size': `${settings.fontSize}px`,
      '--editor-font': settings.fontFamily,
    }}>
      <CodeMirror
        ref={editorRef}
        value={activeTab?.content || ''}
        onChange={onChange}
        extensions={extensions}
        basicSetup={{
          lineNumbers: settings.lineNumbers,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          highlightSelectionMatches: true,
          searchKeymap: true,
          tabSize: settings.tabSize,
        }}
        theme="none"
        height="100%"
        style={{ height: '100%' }}
      />
    </div>
  );
}
