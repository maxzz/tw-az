import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import { DEFAULT_EXTENSIONS, IGNORED_DIRECTORIES } from "./8-constants";
import { extractClassStrings } from "./2-extract";
import { checkClassString, sortClassString } from "./3-sort";
import type { FileViolation, FixReplacement, ScanOptions } from "./9-types";

// Run the scan

export function runScan(paths: string[], options: ScanOptions = {}): { fileCount: number; violations: FileViolation[]; fixedCount: number; } {
    const extensions = options.extensions ?? DEFAULT_EXTENSIONS;
    const rootDir = resolve(paths[0] ?? ".");
    const files = collectFiles(paths.length > 0 ? paths : ["."], extensions);

    let fixedCount = 0;

    if (options.fix) {
        for (const file of files) {
            const content = readFileSync(file, "utf8");
            fixedCount += applyFixes(file, extractClassStrings(content));
        }

        console.log(`Scanned ${files.length} files`);
        console.log(`Fixed ${fixedCount} class string${fixedCount === 1 ? "" : "s"}\n`);

        if (fixedCount > 0) {
            console.log("Re-checking after fix...\n");

            const remaining = scanForViolations(files, rootDir);
            return { fileCount: files.length, violations: remaining, fixedCount };
        }

        return { fileCount: files.length, violations: [], fixedCount };
    }

    const violations = scanForViolations(files, rootDir);
    return { fileCount: files.length, violations, fixedCount: 0 };
}

function scanForViolations(filePaths: string[], rootDir: string): FileViolation[] {
    const violations: FileViolation[] = [];

    for (const file of filePaths) {
        const content = readFileSync(file, "utf8");
        const rel = relative(rootDir, file).replace(/\\/g, "/");

        for (const { value, index } of extractClassStrings(content)) {
            const classViolations = checkClassString(value);
            if (!classViolations.length) {
                continue;
            }

            const line = content.slice(0, index).split("\n").length;
            violations.push({ file: rel, line, value, violations: classViolations });
        }
    }

    return violations;
}

function applyFixes(file: string, matches: ReturnType<typeof extractClassStrings>): number {
    const toApply = matches
        .map(
            ({ index, length, full, value }): FixReplacement | null => {
                if (checkClassString(value).length === 0) {
                    return null;
                }
                const fixed = sortClassString(value);
                if (fixed === value) {
                    return null;
                }
                return {
                    index,
                    length,
                    replacement: full.replace(value, fixed),
                };
            }
        )
        .filter((item): item is FixReplacement => item !== null)
        .sort((a, b) => b.index - a.index);

    if (!toApply.length) {
        return 0;
    }

    let content = readFileSync(file, "utf8");
    for (const { index, length, replacement } of toApply) {
        content = content.slice(0, index) + replacement + content.slice(index + length);
    }
    writeFileSync(file, content, "utf8");

    return toApply.length;
}

// Collect filenames

function collectFiles(paths: string[], extensions: readonly string[]): string[] {
    const files: string[] = [];

    for (const inputPath of paths) {
        const resolved = resolve(inputPath);
        const stat = statSync(resolved);

        if (stat.isDirectory()) {
            walk(resolved, extensions, files);
        } else if (extensions.some((ext) => resolved.endsWith(ext))) {
            files.push(resolved);
        }
    }

    return [...new Set(files)].sort();
}

function walk(dir: string, extensions: readonly string[] = DEFAULT_EXTENSIONS, files: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);

        if (statSync(full).isDirectory()) {
            if (!IGNORED_DIRECTORIES.has(entry)) {
                walk(full, extensions, files);
            }
        } else if (extensions.some((ext) => entry.endsWith(ext))) {
            files.push(full);
        }
    }
    return files;
}
