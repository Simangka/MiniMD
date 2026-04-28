import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useApp } from '../context/AppContext';
import { useMemo } from 'react';

export function Preview() {
  const { activeTab, settings } = useApp();

  const content = activeTab?.content || '';

  // Memoize the components config
  const components = useMemo(() => ({
    // Custom code block renderer with copy button
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const codeText = String(children).replace(/\n$/, '');

      if (!inline && (match || codeText.includes('\n'))) {
        return (
          <div className="code-block">
            {language && <span className="code-lang">{language}</span>}
            <button 
              className="code-copy"
              onClick={() => navigator.clipboard.writeText(codeText)}
              title="Copy code"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" 
                  stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            </button>
            <pre><code className={className} {...props}>{children}</code></pre>
          </div>
        );
      }
      return <code className={`inline-code ${className || ''}`} {...props}>{children}</code>;
    },
    // Custom table renderer
    table({ children }) {
      return (
        <div className="table-wrapper">
          <table>{children}</table>
        </div>
      );
    },
    // Checkbox for task lists
    input({ type, checked, ...props }) {
      if (type === 'checkbox') {
        return (
          <input type="checkbox" checked={checked} readOnly className="task-checkbox" {...props} />
        );
      }
      return <input type={type} {...props} />;
    },
    // Links open externally
    a({ href, children, ...props }) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    },
    // Blockquote styling
    blockquote({ children }) {
      return <blockquote className="md-blockquote">{children}</blockquote>;
    },
  }), []);

  if (!content.trim()) {
    return (
      <div className="preview-container" style={{ '--preview-font-size': `${settings.previewFontSize}px` }}>
        <div className="preview-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.2">
            <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm14 0l3.5 7L14 21l3.5-7z" 
              fill="currentColor"/>
          </svg>
          <p>Start typing to see preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container" style={{ '--preview-font-size': `${settings.previewFontSize}px` }}>
      <div className="preview-content markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
