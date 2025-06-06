// content.js – runs inside Metabase pages

let aiBtn;

/**
 * Try to locate the SQL editor (Monaco or CodeMirror 6)
 * and inject our floating "💡 AI" button once.
 */
function maybeAddButton() {
  // Monaco in Metabase 49+ has class .monaco-editor; fallback to textarea
  const editorRoot =
    document.querySelector('.monaco-editor') ||
    document.querySelector('textarea.sql-editor');

  if (!editorRoot || aiBtn) return;

  /* Prepare host for absolute-positioned button */
  const host = editorRoot.parentElement;
  host.style.position = 'relative';

  aiBtn = document.createElement('button');
  aiBtn.textContent = '💡 AI';
  aiBtn.title = 'Generate SQL with AI';
  aiBtn.style.cssText = `
      position:absolute;
      top:8px; right:8px; z-index:9999;
      padding:4px 8px; font-size:12px;
      cursor:pointer; border-radius:4px;
  `;
  host.appendChild(aiBtn);

  aiBtn.addEventListener('click', async () => {
    /* Send current selection (if any) so the popup can preload it */
    const selection = window.getSelection().toString();
    chrome.runtime.sendMessage({ type: 'openPopup', selection });
    // The popup opens automatically when its default_popup is set.
  });
}

/* Keep scanning until the editor shows up */
const obs = new MutationObserver(maybeAddButton);
obs.observe(document.body, { childList: true, subtree: true });
maybeAddButton();

/* Receive SQL back from popup and inject into the editor */
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== 'injectSQL' || !msg.sql) return;

  /* Monaco editor path */
  const monacoEl = document.querySelector('.monaco-editor');
  if (monacoEl && window.monaco) {
    const model = window.monaco.editor.getEditors()[0]?.getModel();
    if (model) model.setValue(msg.sql);
    return;
  }

  /* Textarea fallback (older Metabase) */
  const ta = document.querySelector('textarea.sql-editor');
  if (ta) {
    ta.value = msg.sql;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }
});
