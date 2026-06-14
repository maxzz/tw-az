import type { FileViolation } from "./9-types";

export function printViolations(violations: FileViolation[], fileCount: number): void {
    const byFile = new Map<string, FileViolation[]>();
    for (const violation of violations) {
        const existing = byFile.get(violation.file);
        if (existing) {
            existing.push(violation);
        } else {
            byFile.set(violation.file, [violation]);
        }
    }

    console.log(`Scanned ${fileCount} files`);
    console.log(
        `Found ${violations.length} class strings with order violations in ${byFile.size} files\n`,
    );

    for (const [file, items] of [...byFile.entries()].sort()) {
        console.log(file);

        for (const item of items) {
            const preview = item.value.length > 100 ? `${item.value.slice(0, 100)}...` : item.value;

            console.log(`  L${item.line}: ${preview}`);
            for (const v of item.violations) {
                console.log(`    - "${v.token}" (${v.group}) appears after ${v.after}`);
            }
        }
        console.log();
    }
}
