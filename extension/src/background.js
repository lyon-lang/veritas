// CoreValidate Background Script

// Listen for extension install
chrome.runtime.onInstalled.addListener((details) => {
  console.log('CoreValidate extension installed');
  
  // Only set defaults on first install, not on updates
  if (details.reason === 'install') {
    chrome.storage.local.set({
      enabled: true,
      autoVerify: true,
      showBadge: true
    });
  }
});

// Listen for tab updates - let content script handle verification
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Content script handles verification via MutationObserver
  // No need to send verify message from background
});

// Listen for messages from popup and content script
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

  if (request.action === 'openTab') {
    chrome.tabs.create({ url: request.url });
    sendResponse({ success: true });
    return true;
  }
});
