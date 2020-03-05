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
