// Focus YT — Content Script
// Applies body classes based on user settings to hide distracting elements.

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

function applySettings(settings) {
  for (const [key, enabled] of Object.entries(settings)) {
    const className = `focusyt-hide-${key}`;
    if (enabled) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
  }
}

// Disable autoplay programmatically when the setting is on
function disableAutoplay(settings) {
  if (!settings.autoplay) return;
  const autoplayButton = document.querySelector(
    '.ytp-autonav-toggle-button[aria-checked="true"]'
  );
  if (autoplayButton) {
    autoplayButton.click();
  }
}

// Load settings and apply
function init() {
  chrome.storage.sync.get({ settings: DEFAULT_SETTINGS }, (data) => {
    const settings = { ...DEFAULT_SETTINGS, ...data.settings };
    applySettings(settings);
    disableAutoplay(settings);
  });
}

// Re-apply on body available (for document_start)
if (document.body) {
  init();
} else {
  const observer = new MutationObserver(() => {
    if (document.body) {
      observer.disconnect();
      init();
    }
  });
  observer.observe(document.documentElement, { childList: true });
}

// Re-apply on YouTube SPA navigation
let lastUrl = location.href;
const navigationObserver = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    init();
  }
});
const observeNavigation = () => {
  navigationObserver.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });
};
if (document.body) {
  observeNavigation();
} else {
  document.addEventListener("DOMContentLoaded", observeNavigation);
}

// Listen for settings changes from popup
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    const settings = { ...DEFAULT_SETTINGS, ...changes.settings.newValue };
    applySettings(settings);
    disableAutoplay(settings);
  }
});
