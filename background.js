// background.js (service-worker)

console.log('installed:', chrome.runtime.getManifest().version);

/**
 * Simple router: popup → content script
 */
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'injectSQL' && sender.tab?.id) {
    chrome.tabs.sendMessage(sender.tab.id, msg);
  }
});

// Handle schema refresh request
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'forceReloadSchema') {
    chrome.storage.local.remove(['cachedSchema', 'cachedAt'], () => {
      sendResponse({ success: true });
    });
    return true; // Keep the message channel open for async response
  }
});
