// Send message to content.js when URL changes
chrome.tabs.onActivated.addListener(function (tab) {
  console.log("TAB CHANGED")
  // TODO only do this on pages where we have permission
  chrome.scripting.executeScript({
    target: { tabId: tab.tabId },
    files: ["content.js"]
  });
})

// Fired when a tab is updated.
chrome.tabs.onUpdated.addListener(async function (tab) {
  console.log("TAB UPDATED")
  // TODO only do this on pages where we have permission
  chrome.scripting.executeScript({
    target: { tabId: tab },
    files: ["content.js"]
  });
})

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    if (chrome.runtime.setUninstallURL) {
      chrome.runtime.setUninstallURL('https://forms.gle/Cgv34WVhgms9MChv7');
    }
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(message);
  if (message.srmStatus === 'ON') {
    chrome.action.setIcon({tabId: sender.tab.id, path: 'icon128.png'});
  }
  if (message.srmStatus === 'OK') {
    chrome.action.setIcon({tabId: sender.tab.id, path: 'icon128green.png'});
  }
  if (message.srmStatus === 'SRM') {
    chrome.action.setIcon({tabId: sender.tab.id, path: 'icon128red.png'});
  }
});
