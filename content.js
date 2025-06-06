// Content script that will be injected into web pages
console.log('Metabase Pomocnicek content script loaded');

// Example of sending a message to the background script
chrome.runtime.sendMessage({ type: 'contentScriptLoaded' }); 