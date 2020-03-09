// Send message to content.js when URL changes
chrome.tabs.onUpdated.addListener(function
  (tabId, changeInfo, tab) {
    if (changeInfo.url) {
      chrome.tabs.sendMessage(tabId, {
        message: 'URL has changed',
        url: changeInfo.url
      })
    }
  });

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    if (chrome.runtime.setUninstallURL) {
      chrome.runtime.setUninstallURL('https://forms.gle/Cgv34WVhgms9MChv7');
    }
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(message);
  if (message.badgeBackgroundColor) {
    chrome.browserAction.setBadgeBackgroundColor({color: message.badgeBackgroundColor});
  }
  if (message.badgeText) {
    chrome.tabs.get(sender.tab.id, function(tab) {
      if (chrome.runtime.lastError) {
        return; // the prerendered tab has been nuked, happens in omnibox search
      }
      if (tab.index >= 0) { // tab is visible
        chrome.browserAction.setBadgeText({tabId:tab.id, text:message.badgeText});
      } else { // prerendered tab, invisible yet, happens quite rarely
        var tabId = sender.tab.id, text = message.badgeText;
        chrome.webNavigation.onCommitted.addListener(function update(details) {
          if (details.tabId == tabId) {
            chrome.browserAction.setBadgeText({tabId: tabId, text: text});
            chrome.webNavigation.onCommitted.removeListener(update);
          }
        });
      }
    });
  }
});
