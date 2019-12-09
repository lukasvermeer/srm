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
