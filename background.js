// Service worker to handle extension icon clicks
chrome.action.onClicked.addListener((_tab) => {
  // Open the extension interface in a new tab
  chrome.tabs.create({
    url: chrome.runtime.getURL('popup.html')
  });
});
