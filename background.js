// background.js (service-worker)

// eslint-disable-next-line no-console
console.log('installed:', chrome.runtime.getManifest().version);

/**
 * Simple router: popup → content script
 */
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'injectSQL' && sender.tab?.id) {
    chrome.tabs.sendMessage(sender.tab.id, msg);
    return true;
  }
  return false;
});

// Handle schema refresh request
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'forceReloadSchema') {
    chrome.storage.local.remove(['cachedSchema', 'cachedAt'], () => {
      sendResponse({ success: true });
    });
    return true; // Keep the message channel open for async response
  }
  return false;
});
