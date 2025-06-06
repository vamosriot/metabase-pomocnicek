// options.js
import { getKey, setKey } from './util.js';

const keyInput = document.getElementById('key');
const saveBtn  = document.getElementById('save');
const savedLbl = document.getElementById('saved');
const refreshBtn = document.getElementById('refresh');

(async () => { keyInput.value = await getKey() || ''; })();

saveBtn.onclick = async () => {
  await setKey(keyInput.value.trim());
  savedLbl.style.visibility = 'visible';
  setTimeout(() => savedLbl.style.visibility = 'hidden', 1500);
};

refreshBtn.onclick = async () => {
  await chrome.runtime.sendMessage({ type: 'forceReloadSchema' });
  refreshBtn.textContent = '✓ Refreshed!';
  setTimeout(() => refreshBtn.textContent = 'Refresh Schema', 1500);
};
