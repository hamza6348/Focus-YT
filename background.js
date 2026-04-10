// Focus YT — Background Service Worker
// Sets default settings on install.

const DEFAULT_SETTINGS = {
  homefeed: true,
  sidebar: true,
  comments: true,
  shorts: true,
  trending: true,
  endcards: true,
  autoplay: true,
  notifications: false,
  chat: true,
  searchsuggestions: false,
  promos: true,
  voicesearch: false,
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ settings: null }, (data) => {
    if (!data.settings) {
      chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
    }
  });
});
