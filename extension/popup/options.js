/* CandlePilot Companion — options page.
 * Stores { apiBase, appBase, timeframe } in chrome.storage.sync.
 */

const DEFAULTS = {
  apiBase: "http://localhost:8000",
  appBase: "http://localhost:3000",
  timeframe: "1h",
};

(async () => {
  const form = document.getElementById("settingsForm");
  const status = document.getElementById("status");
  const fields = {
    apiBase: document.getElementById("apiBase"),
    appBase: document.getElementById("appBase"),
    timeframe: document.getElementById("timeframe"),
  };

  const current = { ...DEFAULTS, ...(await chrome.storage.sync.get(Object.keys(DEFAULTS))) };
  fields.apiBase.value = current.apiBase;
  fields.appBase.value = current.appBase;
  fields.timeframe.value = current.timeframe;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const next = {
      apiBase: fields.apiBase.value.trim() || DEFAULTS.apiBase,
      appBase: fields.appBase.value.trim() || DEFAULTS.appBase,
      timeframe: fields.timeframe.value,
    };
    await chrome.storage.sync.set(next);
    status.textContent = "Saved.";
    window.setTimeout(() => (status.textContent = ""), 1500);
  });
})();
