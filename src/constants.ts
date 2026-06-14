export const DEFAULT_EXTENSIONS = [".tsx", ".jsx"] as const;

export const VARIANT = 11;
export const TRANSITION = 12;
export const BORDER = 13;
export const ROUNDING = 14;
export const SHADOW = 15;
export const TRUNCATE_OVERFLOW = 16;
export const CHILDREN = 17;
export const END = 18;
export const UNKNOWN = 999;

export const GROUP_NAMES: readonly string[] = [
  "position anchor",
  "position offsets",
  "self & group",
  "element",
  "margin & padding",
  "width & height",
  "display",
  "text size",
  "font",
  "text color",
  "background & fill color",
  "variant modifiers",
  "transition",
  "border",
  "rounding",
  "shadow",
  "truncate & overflow",
  "children",
  "end",
];

export const TEXT_SIZES: ReadonlySet<string> = new Set<string>([
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
  "text-7xl",
  "text-8xl",
  "text-9xl",
]);

export const CLASS_PATTERNS: readonly RegExp[] = [
  /className\s*=\s*"([^"]+)"/g,
  /className\s*=\s*'([^']+)'/g,
  /className\s*=\s*\{`([^`]+)`\}/g,
  /className\s*=\s*\{\s*["'`]([^"'`]+)["'`]\s*\}/g,
  /class\s*=\s*"([^"]+)"/g,
  /cn\(\s*["'`]([^"'`]+)["'`]/g,
  /classNames\(\s*["'`]([^"'`]+)["'`]/g,
];

export const IGNORED_DIRECTORIES: ReadonlySet<string> = new Set([
  "node_modules",
  "dist",
  ".git",
]);
