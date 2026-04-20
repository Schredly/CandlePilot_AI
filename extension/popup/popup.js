/* CandlePilot Companion — popup logic.
 *
 * Pulled by popup.html when the user clicks the extension icon. Flow:
 *   1. Detect a symbol from the active tab's URL.
 *   2. Load user settings (API base, app base, default timeframe) from storage.
 *   3. Fetch /api/v1/strategies/{symbol} and /api/v1/patterns/{symbol}.
 *   4. Render the most-recent N of each.
 *
 * All DOM rendering uses textContent — no HTML injection from network data.
 */

const DEFAULTS = {
  apiBase: "http://localhost:8000",
  appBase: "http://localhost:3000",
  timeframe: "1h",
};

const SIGNAL_LIMIT = 4;
const PATTERN_LIMIT = 4;

// ── URL → ticker extraction ────────────────────────────────────────────────
/** @type {Array<{name: string, match: (url: URL) => string | null}>} */
const SITE_RULES = [
  {
    name: "Yahoo Finance",
    match: (u) => {
      if (!u.hostname.endsWith("finance.yahoo.com")) return null;
      const m = u.pathname.match(/^\/quote\/([A-Z0-9\.\-=\^]+)/i);
      return m ? m[1].toUpperCase().split(".")[0] : null;
    },
  },
  {
    name: "TradingView",
    match: (u) => {
      if (!u.hostname.endsWith("tradingview.com")) return null;
      // /symbols/NASDAQ-AAPL/ or /chart/?symbol=NASDAQ%3AAAPL
      let m = u.pathname.match(/\/symbols\/[A-Z]+-([A-Z0-9\.\-]+)/i);
      if (m) return m[1].toUpperCase();
      const sym = u.searchParams.get("symbol");
      if (sym) {
        const parts = sym.split(":");
        return (parts[parts.length - 1] || "").toUpperCase() || null;
      }
      return null;
    },
  },
  {
    name: "Google Finance",
    match: (u) => {
      if (!u.hostname.endsWith("google.com")) return null;
      const m = u.pathname.match(/^\/finance\/quote\/([A-Z0-9\.\-]+)/i);
      return m ? m[1].toUpperCase() : null;
    },
  },
  {
    name: "Schwab",
    match: (u) => {
      if (!u.hostname.includes("schwab.com")) return null;
      const sym = u.searchParams.get("symbol") || u.searchParams.get("sym");
      return sym ? sym.toUpperCase() : null;
    },
  },
  {
    name: "Generic ?symbol=",
    match: (u) => {
      const sym = u.searchParams.get("symbol");
      return sym && /^[A-Z0-9\.\-]{1,10}$/i.test(sym) ? sym.toUpperCase() : null;
    },
  },
];

/**
 * Pure helper — exported on globalThis for tests.
 * @param {string} rawUrl
 * @returns {{symbol: string, source: string} | null}
 */
function extractSymbolFromUrl(rawUrl) {
  let u;
  try { u = new URL(rawUrl); } catch { return null; }
  for (const rule of SITE_RULES) {
    const symbol = rule.match(u);
    if (symbol) return { symbol, source: rule.name };
  }
  return null;
}

globalThis.__extractSymbolFromUrl = extractSymbolFromUrl;

// ── Chrome API helpers ─────────────────────────────────────────────────────
async function getActiveTabUrl() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab?.url || null;
  } catch {
    return null;
  }
}

async function loadSettings() {
  try {
    const stored = await chrome.storage.sync.get(Object.keys(DEFAULTS));
    return { ...DEFAULTS, ...stored };
  } catch {
    return { ...DEFAULTS };
  }
}

// ── Rendering ──────────────────────────────────────────────────────────────
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) node.appendChild(c);
  return node;
}

function formatTime(unixSeconds) {
  if (!unixSeconds) return "";
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatPrice(n) {
  if (typeof n !== "number") return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function renderSignals(signals) {
  const list = document.getElementById("signals");
  const empty = document.getElementById("signalsEmpty");
  list.innerHTML = "";

  if (!signals || signals.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  // Most recent first
  const recent = [...signals].reverse().slice(0, SIGNAL_LIMIT);
  for (const s of recent) {
    const dirCls = s.direction === "LONG" ? "bullish" : "bearish";
    const li = el("li", {}, [
      el("div", { class: "left" }, [
        el("div", { class: "title", text: s.strategy.replace(/_/g, " ") }),
        el("div", { class: "sub", text: s.notes || "" }),
        el("div", { class: "meta", text: formatTime(s.time) }),
      ]),
      el("div", { class: "right" }, [
        el("div", { class: dirCls, text: s.direction }),
        el("div", { class: "meta", text: `E ${formatPrice(s.entry)}` }),
        el("div", { class: "meta", text: `T ${formatPrice(s.target)} · S ${formatPrice(s.stop)}` }),
        el("div", { class: "meta" }, [el("span", { class: "confidence-pill", text: `${s.confidence}%` })]),
      ]),
    ]);
    list.appendChild(li);
  }
}

function renderPatterns(patterns) {
  const list = document.getElementById("patterns");
  const empty = document.getElementById("patternsEmpty");
  list.innerHTML = "";

  if (!patterns || patterns.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  const recent = [...patterns].reverse().slice(0, PATTERN_LIMIT);
  for (const p of recent) {
    const dirCls = p.direction === "bullish" ? "bullish" : p.direction === "bearish" ? "bearish" : "neutral";
    const li = el("li", {}, [
      el("div", { class: "left" }, [
        el("div", { class: "title", text: p.pattern.replace(/_/g, " ") }),
        el("div", { class: "meta", text: formatTime(p.time) }),
      ]),
      el("div", { class: "right" }, [
        el("div", { class: dirCls, text: p.direction }),
        el("div", { class: "meta" }, [el("span", { class: "confidence-pill", text: `${p.confidence}%` })]),
      ]),
    ]);
    list.appendChild(li);
  }
}

function showNoSymbol() {
  document.getElementById("symbolCard").classList.add("hidden");
  document.querySelectorAll(".panel").forEach((n) => n.classList.add("hidden"));
  document.getElementById("noSymbol").classList.remove("hidden");
  document.getElementById("status").textContent = "No symbol detected.";
}

function showSymbol(symbol, sourceLabel, url) {
  document.getElementById("symbolCard").classList.remove("hidden");
  document.querySelectorAll(".panel").forEach((n) => n.classList.remove("hidden"));
  document.getElementById("noSymbol").classList.add("hidden");

  document.getElementById("symbolTicker").textContent = symbol;
  document.getElementById("symbolSource").textContent = `${sourceLabel} · ${url}`;
}

function setStatus(msg) {
  document.getElementById("status").textContent = msg;
}

// ── Fetching ───────────────────────────────────────────────────────────────
async function fetchJson(url) {
  const res = await fetch(url, { credentials: "omit" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function loadForSymbol(apiBase, symbol, timeframe) {
  setStatus("Loading…");
  try {
    const [signals, patterns] = await Promise.all([
      fetchJson(`${apiBase}/api/v1/strategies/${encodeURIComponent(symbol)}?timeframe=${encodeURIComponent(timeframe)}&limit=20`).catch((e) => {
        console.warn("strategies failed", e);
        return { signals: [] };
      }),
      fetchJson(`${apiBase}/api/v1/patterns/${encodeURIComponent(symbol)}?timeframe=${encodeURIComponent(timeframe)}&limit=20`).catch((e) => {
        console.warn("patterns failed", e);
        return { patterns: [] };
      }),
    ]);
    renderSignals(signals?.signals || []);
    renderPatterns(patterns?.patterns || []);
    setStatus(`Updated · ${new Date().toLocaleTimeString()}`);
  } catch (e) {
    setStatus(`Error: ${e.message}`);
  }
}

// ── Wire-up on load ────────────────────────────────────────────────────────
(async () => {
  const settings = await loadSettings();
  const tfSelect = document.getElementById("timeframe");
  tfSelect.value = settings.timeframe;

  const tabUrl = await getActiveTabUrl();
  const detection = tabUrl ? extractSymbolFromUrl(tabUrl) : null;

  document.getElementById("openApp").addEventListener("click", () => {
    const symbol = detection?.symbol;
    const path = symbol ? `/symbol/${encodeURIComponent(symbol)}` : "/";
    chrome.tabs.create({ url: settings.appBase + path });
  });

  document.getElementById("refresh").addEventListener("click", () => {
    if (detection) loadForSymbol(settings.apiBase, detection.symbol, tfSelect.value);
  });

  tfSelect.addEventListener("change", () => {
    if (detection) loadForSymbol(settings.apiBase, detection.symbol, tfSelect.value);
  });

  document.getElementById("openOptions").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  if (!detection) {
    showNoSymbol();
    return;
  }

  showSymbol(detection.symbol, detection.source, tabUrl);
  await loadForSymbol(settings.apiBase, detection.symbol, tfSelect.value);
})();
