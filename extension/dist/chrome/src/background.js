// CoreValidate Background Script
// Cross-browser compatible using webextension-polyfill

// Use browser namespace (polyfilled for Chrome)
const api = typeof browser !== 'undefined' ? browser : chrome;

// Listen for extension install
api.runtime.onInstalled.addListener((details) => {
  console.log('CoreValidate extension installed');
  
  // Only set defaults on first install, not on updates
  if (details.reason === 'install') {
    api.storage.local.set({
      enabled: true,
      autoVerify: true,
      showBadge: true
    });
  }
});

// Listen for tab updates - let content script handle verification
api.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Content script handles verification via MutationObserver
  // No need to send verify message from background
});

// Listen for messages from popup and content script
api.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    api.storage.local.get(['enabled', 'autoVerify', 'showBadge']).then((data) => {
      sendResponse(data);
    });
    return true;
  }
  
  if (request.action === 'updateSettings') {
    api.storage.local.set(request.settings).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'clearHistory') {
    api.storage.local.set({ verifications: [] }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'openTab') {
    api.tabs.create({ url: request.url });
    sendResponse({ success: true });
    return true;
  }
});
