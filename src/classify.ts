import {
  BORDER,
  CHILDREN,
  END,
  ROUNDING,
  SHADOW,
  TEXT_SIZES,
  TRANSITION,
  TRUNCATE_OVERFLOW,
  VARIANT,
} from "./constants";

export function baseToken(token: string): string {
  if (/^group\/[\w-]+$/.test(token)) {
    return token;
  }
  const parts = token.split(":");
  return parts[parts.length - 1] ?? token;
}

export function hasVariantPrefix(token: string): boolean {
  if (/^group\/[\w-]+$/.test(token)) {
    return false;
  }
  return token.includes(":");
}

export function classify(token: string): number {
  const base = baseToken(token);
  const variant = hasVariantPrefix(token);

  // 19 — end (always last)
  if (
    /^(?:cursor-|pointer-events)/.test(base) ||
    base === "pointer-events-none" ||
    /^z-/.test(base)
  ) {
    return END;
  }

  // 1 — position anchor
  if (/^(?:relative|absolute|fixed|sticky|static)/.test(base)) {
    return variant ? VARIANT : 0;
  }

  // 2 — position offsets (immediately after anchor)
  if (/^(?:inset-|top-|right-|bottom-|left-)/.test(base)) {
    return variant ? VARIANT : 1;
  }

  // 3 — self & group
  if (/^self-/.test(base) || base === "group" || /^group\//.test(base)) {
    return 2;
  }

  // 13 — transition (including variant-prefixed)
  if (/^(?:transition|duration|animate)/.test(base)) {
    return TRANSITION;
  }

  // 17 — truncate & overflow
  if (base === "truncate" || base === "text-ellipsis" || /^overflow-/.test(base)) {
    return TRUNCATE_OVERFLOW;
  }

  // 18 — children (grid before flex in same group)
  if (
    /^grid(?:-|$)/.test(base) ||
    base === "grid" ||
    /^inline-grid/.test(base) ||
    /^flex(?:-|$)/.test(base) ||
    base === "flex" ||
    /^inline-flex/.test(base) ||
    /^gap-/.test(base) ||
    /^items-/.test(base) ||
    /^justify-/.test(base) ||
    /^content-/.test(base) ||
    /^place-/.test(base) ||
    /^order-/.test(base) ||
    /^col-/.test(base) ||
    /^row-/.test(base) ||
    /^space-[xy]-/.test(base) ||
    /^list-/.test(base)
  ) {
    return variant ? VARIANT : CHILDREN;
  }

  // 4 — element
  if (
    /^(?:shrink|grow)$/.test(base) ||
    /^shrink-/.test(base) ||
    /^grow-/.test(base) ||
    /^basis-/.test(base) ||
    /^select-/.test(base) ||
    /^whitespace-/.test(base) ||
    base === "compress-zero"
  ) {
    return 3;
  }

  // 5 — margin & padding (unprefixed only; prefixed → variant modifiers)
  if (
    !variant &&
    /^(?:m-|mx-|my-|mt-|mr-|mb-|ml-|p-|px-|py-|pt-|pr-|pb-|pl-)/.test(base)
  ) {
    return 4;
  }

  // 6 — width & height
  if (/^(?:w-|h-|min-w-|max-w-|min-h-|max-h-|size-|aspect-)/.test(base)) {
    return 5;
  }

  // 7 — display
  if (["block", "inline", "hidden", "visible", "isolate"].includes(base)) {
    return variant ? VARIANT : 6;
  }

  // 8 — text size
  if (TEXT_SIZES.has(base)) {
    return 7;
  }

  // 9 — font
  if (/^font-/.test(base)) {
    return 8;
  }

  // 14–16 — border, rounding, shadow (variant-prefixed → modifiers)
  if (/^(?:border|outline-|ring-|divide-)/.test(base) && !/^rounded/.test(base)) {
    return variant ? VARIANT : BORDER;
  }
  if (/^rounded/.test(base)) {
    return variant ? VARIANT : ROUNDING;
  }
  if (/^shadow/.test(base)) {
    return variant ? VARIANT : SHADOW;
  }

  // 10 — text color (unprefixed only)
  if (!variant && /^text-/.test(base) && !TEXT_SIZES.has(base)) {
    return 9;
  }

  // 11 — background & fill color (unprefixed only)
  if (
    !variant &&
    /^(?:bg-|fill-|stroke-|from-|to-|via-|opacity-|accent-|caret-|decoration-)/.test(base)
  ) {
    return 10;
  }

  // 12 — variant modifiers (remaining prefixed utilities)
  if (variant) {
    return VARIANT;
  }

  return -1;
}
