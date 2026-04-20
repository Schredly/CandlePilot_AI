"""Pure functions that look at a rolling candle buffer and return a match or None.

Each detector takes `candles` with the most recent bar last and returns a
`(pattern, direction, confidence)` triple, or None if the shape doesn't fit.
The engine wraps the match into a `DetectedPattern` with symbol/timeframe/time.

Confidence scoring is intentionally interpretable:
  base 40  → baseline for matching the structural criteria
  + shape  → how cleanly the candle matches (shadow ratios, body position)
  + context → engulfing ratio, inside-bar compression, etc.
Capped at 100.
"""

from collections.abc import Sequence

from app.market_data.types import Candle

from .types import PatternDirection, PatternName

Match = tuple[PatternName, PatternDirection, int]

_EPS = 1e-9


def _body(c: Candle) -> float:
    return abs(c.close - c.open)


def _range(c: Candle) -> float:
    return max(c.high - c.low, 0.0)


def _upper_shadow(c: Candle) -> float:
    return c.high - max(c.open, c.close)


def _lower_shadow(c: Candle) -> float:
    return min(c.open, c.close) - c.low


def detect_hammer(candles: Sequence[Candle]) -> Match | None:
    """Bullish reversal: small body near top, long lower shadow (≥ 2× body)."""
    if not candles:
        return None
    c = candles[-1]
    rng = _range(c)
    body = _body(c)
    if rng <= 0 or body <= 0:
        return None

    lower = _lower_shadow(c)
    upper = _upper_shadow(c)

    if lower < 2.0 * body or upper > body:
        return None

    # Body must sit in the top third of the range.
    body_top = max(c.open, c.close)
    if (c.high - body_top) / rng > 0.33:
        return None

    ratio_score = min(40.0, (lower / body) * 10.0)
    upper_score = max(0.0, 20.0 - (upper / body) * 20.0)
    confidence = int(min(100.0, 40.0 + ratio_score + upper_score))
    return ("hammer", "bullish", confidence)


def detect_shooting_star(candles: Sequence[Candle]) -> Match | None:
    """Bearish reversal: small body near bottom, long upper shadow (≥ 2× body)."""
    if not candles:
        return None
    c = candles[-1]
    rng = _range(c)
    body = _body(c)
    if rng <= 0 or body <= 0:
        return None

    upper = _upper_shadow(c)
    lower = _lower_shadow(c)

    if upper < 2.0 * body or lower > body:
        return None

    body_bottom = min(c.open, c.close)
    if (body_bottom - c.low) / rng > 0.33:
        return None

    ratio_score = min(40.0, (upper / body) * 10.0)
    lower_score = max(0.0, 20.0 - (lower / body) * 20.0)
    confidence = int(min(100.0, 40.0 + ratio_score + lower_score))
    return ("shooting_star", "bearish", confidence)


def detect_doji(candles: Sequence[Candle]) -> Match | None:
    """Indecision: body is a tiny fraction (≤ 10%) of the total range."""
    if not candles:
        return None
    c = candles[-1]
    rng = _range(c)
    if rng <= 0:
        return None

    body = _body(c)
    body_pct = body / (rng + _EPS)
    if body_pct > 0.10:
        return None

    # Tighter body → higher confidence. 0% body → 100, 10% body → 50.
    confidence = int(min(100.0, 50.0 + (1.0 - body_pct * 10.0) * 50.0))
    return ("doji", "neutral", confidence)


def detect_engulfing(candles: Sequence[Candle]) -> Match | None:
    """Two-bar reversal: current body swallows the previous body and flips colour."""
    if len(candles) < 2:
        return None
    prev, curr = candles[-2], candles[-1]

    prev_body = _body(prev)
    curr_body = _body(curr)
    if prev_body <= 0 or curr_body <= 0:
        return None

    prev_red = prev.close < prev.open
    prev_green = prev.close > prev.open
    curr_red = curr.close < curr.open
    curr_green = curr.close > curr.open

    # Bullish engulfing: red → green, current body covers previous body.
    if prev_red and curr_green and curr.open <= prev.close and curr.close >= prev.open:
        ratio = curr_body / prev_body
        ratio_score = min(40.0, ratio * 10.0)
        confidence = int(min(100.0, 50.0 + ratio_score))
        return ("engulfing", "bullish", confidence)

    # Bearish engulfing: green → red, current body covers previous body.
    if prev_green and curr_red and curr.open >= prev.close and curr.close <= prev.open:
        ratio = curr_body / prev_body
        ratio_score = min(40.0, ratio * 10.0)
        confidence = int(min(100.0, 50.0 + ratio_score))
        return ("engulfing", "bearish", confidence)

    return None


def detect_inside_bar(candles: Sequence[Candle]) -> Match | None:
    """Consolidation: current high < prev high AND current low > prev low."""
    if len(candles) < 2:
        return None
    prev, curr = candles[-2], candles[-1]

    if curr.high >= prev.high or curr.low <= prev.low:
        return None

    prev_range = _range(prev)
    curr_range = _range(curr)
    if prev_range <= 0:
        return None

    # Tighter compression → higher confidence. Same-size inside bar → 50, zero-range → 100.
    compression = 1.0 - (curr_range / prev_range)
    confidence = int(min(100.0, 50.0 + compression * 50.0))
    return ("inside_bar", "neutral", confidence)


# Ordered list used by the engine; first match per bar wins for each distinct
# pattern, but the engine runs every detector so different patterns can co-fire.
ALL_DETECTORS = (
    detect_hammer,
    detect_shooting_star,
    detect_doji,
    detect_engulfing,
    detect_inside_bar,
)
