# Sourcemap generation problem
_Exported on 6/18/2026 at 17:20:49 PDT from Cursor (3.8.11)_

---

**User**

How to fix this message to fix source maps

---

**Cursor**

Investigating the build configuration and tsdown/rolldown setup to fix the source map warning.


Testing which config changes suppress the warning:


This warning comes from a known interaction between **tsdown + `dts: true` + source maps**, not from broken output in your project.

## What’s happening

Your `tsconfig.json` has:

```13:14:c:\y\w\1-node\1-utils\tw-az\tsconfig.json
        "declarationMap": true,
        "sourceMap": true,
```

With `declarationMap: true`, tsdown **always enables source maps** (even if you pass `--sourcemap false`). That turns on `rolldown-plugin-dts`’s internal `fake-js` plugin, which creates synthetic JS stubs for `.d.ts` files. That plugin transforms code **without** emitting a source map, so Rolldown prints `SOURCEMAP_BROKEN`.

Your actual maps look fine — e.g. `dist/cli.mjs.map` correctly points at `src/cli.ts`, `src/0-args.ts`, etc. The build completes successfully; this is a diagnostic warning about an internal plugin step.

## Options

### 1. Ignore it (recommended)

If you want JS + declaration maps, keep your current setup. The warning is noisy but your published `.mjs.map` and `.d.mts.map` files are usable. This needs an upstream fix in `rolldown-plugin-dts` (the plugin should return `map: null` explicitly for those transforms).

### 2. Drop source maps entirely (silences the warning)

Remove both from `tsconfig.json`:

```json
"declarationMap": false,
"sourceMap": false,
```

And don’t set `sourcemap` in `tsdown.config.ts`. No warning, but you lose debugging in `dist/` and “go to source” from `.d.mts` files.

### 3. Keep types, drop maps only for the bundle

If you don’t need to debug the built CLI (you already use `tsx src/cli.ts` in dev), option 2 is reasonable for a tool like this.

### 4. Suppress the warning in config (cosmetic only)

If the message is annoying but you want to keep maps:

```ts
import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["./src/index.ts", "./src/cli.ts"],
    format: "esm",
    dts: true,
    clean: true,
    target: "node18",
    inputOptions(options) {
        return {
            ...options,
            onLog(level, log, handler) {
                if (log.code === "SOURCEMAP_BROKEN") return;
                handler(level, log);
            },
        };
    },
});
```

This hides the warning; it doesn’t change how maps are generated.

### 5. Split type generation (heavyweight)

Set `dts: false` in tsdown and emit declarations with `tsc --emitDeclarationOnly` in a separate script. Avoids the plugin conflict, but adds complexity for little benefit here.

---

**Bottom line:** Your source maps are not meaningfully broken for your own code. The warning is a Rolldown/tsdown ecosystem issue when `dts: true` and source maps are both on. For a CLI library, either ignore it or remove `sourceMap`/`declarationMap` if you don’t need maps in `dist/`.

If you want, I can apply option 4 (suppress the warning) or option 2 (remove maps) in your config.

---

**User**

Let's go with option four.

---

**Cursor**

Added an `onLog` filter in `tsdown.config.ts` to suppress the `SOURCEMAP_BROKEN` warning. The build now completes cleanly and still emits all `.map` files as before.

