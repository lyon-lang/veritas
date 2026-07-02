// Veritas Background Script

// Listen for extension install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Veritas extension installed');
  
  // Set default settings
  chrome.storage.local.set({
    enabled: true,
    autoVerify: true,
    showBadge: true
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if auto-verify is enabled
    chrome.storage.local.get('autoVerify', (data) => {
      if (data.autoVerify !== false) {
        // Send message to content script to verify
        chrome.tabs.sendMessage(tabId, { action: 'verify' }).catch(() => {
          // Content script not loaded yet, ignore
        });
      }
    });
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.local.get(['enabled', 'autoVerify', 'showBadge'], (data) => {
      sendResponse(data);
    });
    return true;
  }
  
  if (request.action === 'updateSettings') {
    chrome.storage.local.set(request.settings, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'clearHistory') {
    chrome.storage.local.set({ verifications: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
