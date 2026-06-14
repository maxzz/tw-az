# New npm package for tailwind class sorting
_Exported on 6/13/2026 at 19:07:39 PDT from Cursor (3.7.27)_

---

**User**

I liked how this plugin works, and it seems like it could be useful for more than just a single project; 
therefore, based on the tailwind-class-order.mdc file and the check-tailwind-class-order.mjs, 
I need to create a npmjs package that can be registered in the npm registry.
The new npm package project will be located in this folder: "C:\y\w\1-node\1-utils\tw-az".
The name of the new project in npmjs will be "twaz".
This project will be improved and expanded with new features over time, but to start, we need to create a package.json, a README.md, and, of course, a .gitignore file. 
It is also necessary to create a CLI wrapper to launch the script from the command line.
In the README.md file, you need to describe in detail the sorting order for Tailwind classes—that is, the precedence rules.

The check-tailwind-class-order.mjs file must be converted to a typeScript file.
Do not use the 'any' type in typeScript.
To build the javascript for production the tsdown (check this page https://github.com/rolldown/tsdown) package should be used. 
For debugging the tsx (https://github.com/privatenumber/tsx nad docs is here https://tsx.hirok.io) package should be used to run the script.
To run scripts, add a 'scripts' section to the package.json file.
Feel free to ask any questions you may have.

All changes must be made in the new project. This project does not need to be changed.


---

**Cursor**

I'll read the source files and tsdown docs, then scaffold the new `twaz` package with TypeScript, CLI, and build setup.


Fetching tsdown setup details and checking similar package patterns in the workspace.


Checking tsdown CLI/bin configuration and creating the project structure.


Creating the full `twaz` package structure with TypeScript sources, CLI, and build configuration.


Fixing TypeScript config and adding explicit type annotations required by `isolatedDeclarations`.


Removing `.ts` extensions from imports so `tsc --noEmit` passes.


The **`twaz`** npm package is set up at `C:\y\w\1-node\1-utils\tw-az`. Your original template project was not modified.

## Project structure

```
tw-az/
├── package.json          # name: "twaz", bin, scripts
├── tsconfig.json
├── tsdown.config.ts      # production build (tsdown)
├── .gitignore
├── README.md             # full precedence rules + examples
└── src/
    ├── cli.ts            # CLI entry (`twaz` command)
    ├── index.ts          # programmatic API exports
    ├── classify.ts       # token classification
    ├── constants.ts      # groups, patterns, text sizes
    ├── extract.ts        # class string extraction from source
    ├── sort.ts           # sort + violation checking
    ├── scan.ts           # file walking, fix, report
    └── types.ts          # TypeScript interfaces (no `any`)
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Run CLI via **tsx** (debug) |
| `npm run fix` | Run CLI with `--fix` via tsx |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Production build via **tsdown** → `dist/` |
| `prepublishOnly` | Builds automatically before publish |

## CLI usage

```bash
twaz                    # scan current directory
twaz src                # scan a directory
twaz src/Button.tsx     # scan a single file
twaz --fix src          # auto-reorder classes in place
twaz --help
```

Compared to the original script, paths are passed as CLI arguments (default: `.`) instead of being hardcoded to `src/`.

## Verified

- `npm run typecheck` passes
- `npm run build` produces `dist/cli.mjs` and `dist/index.mjs` with types
- `node dist/cli.mjs --help` works
- `npm run dev` scans files correctly via tsx

## Publishing to npm

When you're ready:

```bash
cd C:\y\w\1-node\1-utils\tw-az
npm login
npm publish
```

**Note:** Building with tsdown requires Node **22.18+** (your v24.6.0 is fine). The built output targets Node 18+ for consumers.

The README documents all 19 precedence groups with examples, variant-prefix rules, and before/after code samples. If you want next steps — git init, a license file, CI workflow, or npm org scope (`@yourorg/twaz`) — say what you prefer.

