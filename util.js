// util.js – pulled in via ES modules
export const getKey = () => chrome.storage.sync.get('openaiKey').then((o) => o.openaiKey || '');

export const setKey = (val) => chrome.storage.sync.set({ openaiKey: val });
