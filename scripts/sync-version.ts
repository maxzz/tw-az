import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgPath = join(root, "package.json");
const out = join(root, "src", "8-version.ts");
const bump = process.argv.includes("--bump");

const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version: string; [key: string]: unknown };

if (bump) {
    const parts = pkg.version.split(".");
    if (parts.length !== 3 || parts.some((p) => Number.isNaN(Number(p)))) {
        throw new Error(`Invalid semver in package.json: ${pkg.version}`);
    }
    parts[2] = String(Number(parts[2]) + 1);
    pkg.version = parts.join(".");
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 4)}\n`);
}

writeFileSync(
    out,
    [
        "// Synced from package.json by scripts/sync-version.ts — do not edit by hand.\n",
        `export const VERSION: string = ${JSON.stringify(pkg.version)};`,
        "",
    ].join("\n"),
);
