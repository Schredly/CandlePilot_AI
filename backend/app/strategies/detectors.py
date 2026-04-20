"""Five strategy detectors. Each takes a candle buffer (most recent last) and
returns a StrategyDraft or None.

Design mirrors the pattern detectors: pure functions, no engine state, no I/O.
The StrategyEngine wraps the draft into a StrategySignal with symbol/tf/time
and computes risk_reward. Detectors enforce basic sanity (risk > 0, target on
the correct side of entry) so the engine can trust every returned draft.

The brief specifies five strategies:
  - VWAP reclaim           → cross of rolling 20-bar VWAP
  - Opening range breakout → close outside first-3-bars H/L envelope
  - Pullback continuation  → pullback inside an EMA(20) trend, resolved
  - Mean reversion         → close outside 20-bar ±2σ band
  - Failed breakout        → poked outside prior 10-bar range, closed back in

For this mock/demo build, "opening range" means the first three bars of the
engine's rolling buffer rather than a session-aware window. The shape of the
logic is identical; real providers will supply session-aware ranges in CP-008's
next integration.
"""

from collections.abc import Sequence

from app.market_data.types import Candle

from .indicators import atr, ema, rolling_vwap, stddev
from .types import StrategyDraft

_EPS = 1e-9


def _valid_long(entry: float, stop: float, target: float) -> bool:
    return stop < entry < target and (entry - stop) > 0


def _valid_short(entry: float, stop: float, target: float) -> bool:
    return target < entry < stop and (stop - entry) > 0


# ── 1. VWAP Reclaim ────────────────────────────────────────────────────────
def detect_vwap_reclaim(candles: Sequence[Candle]) -> StrategyDraft | None:
    if len(candles) < 21:
        return None
    vwap = rolling_vwap(candles[-20:])
    if vwap is None:
        return None
    a = atr(candles, 14)
    if a is None or a <= 0:
        return None
    prev, curr = candles[-2], candles[-1]

    # Bullish reclaim
    if prev.close < vwap <= curr.close:
        entry = curr.close
        stop = vwap - a
        risk = entry - stop
        target = entry + 2.0 * risk
        if not _valid_long(entry, stop, target):
            return None
        confidence = 65 + min(20, int(((curr.close - vwap) / a) * 10))
        notes = f"Price reclaimed rolling VWAP at {vwap:.2f} with bullish close."
        return StrategyDraft("vwap_reclaim", "LONG", entry, stop, target, confidence, notes)

    # Bearish loss of VWAP
    if prev.close > vwap >= curr.close:
        entry = curr.close
        stop = vwap + a
        risk = stop - entry
        target = entry - 2.0 * risk
        if not _valid_short(entry, stop, target):
            return None
        confidence = 65 + min(20, int(((vwap - curr.close) / a) * 10))
        notes = f"Price lost rolling VWAP at {vwap:.2f} with bearish close."
        return StrategyDraft("vwap_reclaim", "SHORT", entry, stop, target, confidence, notes)

    return None


# ── 2. Opening Range Breakout ──────────────────────────────────────────────
def detect_opening_range_breakout(candles: Sequence[Candle]) -> StrategyDraft | None:
    if len(candles) < 4:
        return None
    opening = candles[:3]
    or_high = max(c.high for c in opening)
    or_low = min(c.low for c in opening)
    or_range = or_high - or_low
    if or_range <= 0:
        return None

    # Only emit on the first close that breaks the range.
    prior_closes = [c.close for c in candles[3:-1]]
    curr = candles[-1]

    already_broke_up = any(pc > or_high for pc in prior_closes)
    already_broke_down = any(pc < or_low for pc in prior_closes)

    if curr.close > or_high and not already_broke_up:
        entry = curr.close
        stop = or_low
        target = entry + or_range
        if not _valid_long(entry, stop, target):
            return None
        confidence = 60 + min(25, int(((curr.close - or_high) / or_range) * 100))
        notes = f"Price broke above opening range ({or_low:.2f}–{or_high:.2f})."
        return StrategyDraft(
            "opening_range_breakout", "LONG", entry, stop, target, confidence, notes
        )

    if curr.close < or_low and not already_broke_down:
        entry = curr.close
        stop = or_high
        target = entry - or_range
        if not _valid_short(entry, stop, target):
            return None
        confidence = 60 + min(25, int(((or_low - curr.close) / or_range) * 100))
        notes = f"Price broke below opening range ({or_low:.2f}–{or_high:.2f})."
        return StrategyDraft(
            "opening_range_breakout", "SHORT", entry, stop, target, confidence, notes
        )

    return None


# ── 3. Pullback Continuation ───────────────────────────────────────────────
def detect_pullback_continuation(candles: Sequence[Candle]) -> StrategyDraft | None:
    if len(candles) < 25:
        return None
    closes = [c.close for c in candles]
    ema_series = ema(closes, 20)
    if ema_series is None or len(ema_series) < 3:
        return None

    ema_now = ema_series[-1]
    ema_prev = ema_series[-2]
    ema_prev2 = ema_series[-3]
    curr = candles[-1]

    # Pullback candles (last three before current)
    p3, p2, p1 = candles[-4], candles[-3], candles[-2]

    # ── Bullish trend pullback ──
    trend_up = ema_now > ema_prev > ema_prev2 and curr.close > ema_now
    lower_highs = p3.high > p2.high > p1.high
    turn_up = curr.close > curr.open and curr.close > p1.high
    if trend_up and lower_highs and turn_up:
        entry = curr.close
        stop = min(p3.low, p2.low, p1.low)
        risk = entry - stop
        target = entry + 2.0 * risk
        if not _valid_long(entry, stop, target):
            return None
        pct_above = (curr.close - ema_now) / max(ema_now, _EPS)
        confidence = 60 + min(25, int(pct_above * 1000))
        notes = "Uptrend pullback resolved with bullish close above prior bar high."
        return StrategyDraft(
            "pullback_continuation", "LONG", entry, stop, target, confidence, notes
        )

    # ── Bearish trend pullback ──
    trend_dn = ema_now < ema_prev < ema_prev2 and curr.close < ema_now
    higher_lows = p3.low < p2.low < p1.low
    turn_dn = curr.close < curr.open and curr.close < p1.low
    if trend_dn and higher_lows and turn_dn:
        entry = curr.close
        stop = max(p3.high, p2.high, p1.high)
        risk = stop - entry
        target = entry - 2.0 * risk
        if not _valid_short(entry, stop, target):
            return None
        pct_below = (ema_now - curr.close) / max(ema_now, _EPS)
        confidence = 60 + min(25, int(pct_below * 1000))
        notes = "Downtrend pullback resolved with bearish close below prior bar low."
        return StrategyDraft(
            "pullback_continuation", "SHORT", entry, stop, target, confidence, notes
        )

    return None


# ── 4. Mean Reversion (20-bar ±2σ band) ────────────────────────────────────
def detect_mean_reversion(candles: Sequence[Candle]) -> StrategyDraft | None:
    if len(candles) < 21:
        return None
    closes = [c.close for c in candles[-20:]]
    mean = sum(closes) / len(closes)
    sd = stddev(closes, 20)
    if sd is None or sd <= 0:
        return None

    upper = mean + 2.0 * sd
    lower = mean - 2.0 * sd
    curr = candles[-1]

    if curr.close <= lower:
        entry = curr.close
        stop = curr.low - 0.5 * sd
        target = mean
        if not _valid_long(entry, stop, target):
            return None
        sigmas = (mean - curr.close) / sd
        confidence = 55 + min(30, int(sigmas * 15))
        notes = f"Close is {sigmas:.1f}σ below 20-bar mean {mean:.2f}; fade toward mean."
        return StrategyDraft("mean_reversion", "LONG", entry, stop, target, confidence, notes)

    if curr.close >= upper:
        entry = curr.close
        stop = curr.high + 0.5 * sd
        target = mean
        if not _valid_short(entry, stop, target):
            return None
        sigmas = (curr.close - mean) / sd
        confidence = 55 + min(30, int(sigmas * 15))
        notes = f"Close is {sigmas:.1f}σ above 20-bar mean {mean:.2f}; fade toward mean."
        return StrategyDraft("mean_reversion", "SHORT", entry, stop, target, confidence, notes)

    return None


# ── 5. Failed Breakout ────────────────────────────────────────────────────
def detect_failed_breakout(candles: Sequence[Candle]) -> StrategyDraft | None:
    if len(candles) < 12:
        return None
    # Prior range: the 10 bars ending two bars ago (excluding prev + curr).
    history = candles[-12:-2]
    prior_high = max(c.high for c in history)
    prior_low = min(c.low for c in history)
    if prior_high <= prior_low:
        return None
    prev = candles[-2]
    curr = candles[-1]
    range_size = prior_high - prior_low

    # Failed upside breakout → fade short.
    if prev.high > prior_high and curr.close < prior_high and curr.close < curr.open:
        entry = curr.close
        stop = prev.high
        target = prior_low
        if not _valid_short(entry, stop, target):
            return None
        overshoot = (prev.high - prior_high) / range_size
        confidence = 55 + min(30, int(overshoot * 200))
        notes = f"Failed upside breakout above {prior_high:.2f}; closed back in range."
        return StrategyDraft("failed_breakout", "SHORT", entry, stop, target, confidence, notes)

    # Failed downside breakout → fade long.
    if prev.low < prior_low and curr.close > prior_low and curr.close > curr.open:
        entry = curr.close
        stop = prev.low
        target = prior_high
        if not _valid_long(entry, stop, target):
            return None
        overshoot = (prior_low - prev.low) / range_size
        confidence = 55 + min(30, int(overshoot * 200))
        notes = f"Failed downside breakout below {prior_low:.2f}; closed back in range."
        return StrategyDraft("failed_breakout", "LONG", entry, stop, target, confidence, notes)

    return None


ALL_STRATEGIES = (
    detect_vwap_reclaim,
    detect_opening_range_breakout,
    detect_pullback_continuation,
    detect_mean_reversion,
    detect_failed_breakout,
)
