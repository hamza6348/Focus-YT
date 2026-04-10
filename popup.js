// Focus YT — Popup Script

const FEATURES = [
  { key: "homefeed", name: "Homepage Feed", desc: "Hide video recommendations on home" },
  { key: "sidebar", name: "Sidebar / Related", desc: "Hide related videos next to player" },
  { key: "comments", name: "Comments", desc: "Hide the comments section" },
  { key: "shorts", name: "Shorts", desc: "Hide Shorts everywhere" },
  { key: "trending", name: "Trending / Explore", desc: "Hide Trending in sidebar nav" },
  { key: "endcards", name: "End Cards", desc: "Hide end screen overlays & cards" },
  { key: "autoplay", name: "Autoplay", desc: "Hide and disable autoplay toggle" },
  { key: "notifications", name: "Notifications", desc: "Hide notification count badge" },
  { key: "chat", name: "Live Chat", desc: "Hide live chat on streams" },
  { key: "searchsuggestions", name: "Search Suggestions", desc: "Hide search autocomplete dropdown" },
  { key: "promos", name: "Promos & Banners", desc: "Hide promotional banners & ads" },
  { key: "voicesearch", name: "Voice Search", desc: "Hide voice search button" },
];

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

const optionsContainer = document.getElementById("options");
const toggleAllCheckbox = document.getElementById("toggleAll");

function renderOptions(settings) {
  optionsContainer.innerHTML = "";

  for (const feature of FEATURES) {
    const checked = settings[feature.key] ? "checked" : "";
    const option = document.createElement("div");
    option.className = "option";
    option.innerHTML = `
      <div class="option-label">
        <span class="name">${feature.name}</span>
        <span class="desc">${feature.desc}</span>
      </div>
      <label class="switch">
        <input type="checkbox" data-key="${feature.key}" ${checked}>
        <span class="slider"></span>
      </label>
    `;
    optionsContainer.appendChild(option);
  }

  updateToggleAll(settings);
}

function updateToggleAll(settings) {
  const allOn = FEATURES.every((f) => settings[f.key]);
  toggleAllCheckbox.checked = allOn;
}

function saveSettings(settings) {
  chrome.storage.sync.set({ settings });
}

// Load and render
chrome.storage.sync.get({ settings: DEFAULT_SETTINGS }, (data) => {
  const settings = { ...DEFAULT_SETTINGS, ...data.settings };
  renderOptions(settings);
});

// Individual toggle
optionsContainer.addEventListener("change", (e) => {
  if (!e.target.dataset.key) return;
  chrome.storage.sync.get({ settings: DEFAULT_SETTINGS }, (data) => {
    const settings = { ...DEFAULT_SETTINGS, ...data.settings };
    settings[e.target.dataset.key] = e.target.checked;
    saveSettings(settings);
    updateToggleAll(settings);
  });
});

// Toggle all
toggleAllCheckbox.addEventListener("change", () => {
  const value = toggleAllCheckbox.checked;
  chrome.storage.sync.get({ settings: DEFAULT_SETTINGS }, (data) => {
    const settings = { ...DEFAULT_SETTINGS, ...data.settings };
    for (const feature of FEATURES) {
      settings[feature.key] = value;
    }
    saveSettings(settings);
    renderOptions(settings);
  });
});
