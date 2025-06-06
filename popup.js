// popup.js
import { getKey }     from './util.js';
import { getSchema }  from './schema.js';

const promptEl = document.getElementById('prompt');
const runBtn   = document.getElementById('run');
const statusEl = document.getElementById('status');

const status = (msg) => {
  statusEl.textContent = msg;
  statusEl.style.visibility = msg ? 'visible' : 'hidden';
};

/* Pre-fill with current selection, if any */
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'openPopup' && msg.selection)
    promptEl.value = msg.selection;
});

/* Ask the active tab for selection immediately (for first open) */
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString()
  }).then(([{ result }]) => {
    if (result) promptEl.value = result;
  });
});

runBtn.onclick = async () => {
  const nlPrompt = promptEl.value.trim();
  if (!nlPrompt) return;

  const key = await getKey();
  if (!key) { status('🔑 Nejprve zadejte API klíč'); return; }

  /* 1) – načteme (nebo vyjmeme z cache) DB schéma */
  const schema = await getSchema();

  /* 2) – heuristicky vybereme relevantní tabulky */
  const wanted = schema.filter(t => nlPrompt
        .toLowerCase()
        .includes(t.name.split('.').pop().toLowerCase()))
        .slice(0, 8);          // max 8 tabulek, ať není prompt příliš velký

  /* 3) – poskládáme systémové + user zprávy */
  const systemMsg = [
    'You are a senior analytics engineer.',
    'Return ONLY valid, runnable SQL for Metabase.',
    'Here is the database schema JSON:',
    JSON.stringify(wanted, null, 0)   // minifikovaně, šetří tokeny
  ].join('\n');

  status('⏳ Calling model…');
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user',   content: nlPrompt }
        ]
      })
    }).then(r => r.json());

    if (res.error) {
      throw new Error(res.error.message);
    }

    const sql = res.choices[0].message.content.trim();
    await navigator.clipboard.writeText(sql);
    status('✓ SQL zkopírováno do schránky');
  } catch (err) {
    status(`❌ ${err.message}`);
  }
};
