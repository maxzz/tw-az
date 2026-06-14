#!/usr/bin/env node

import { resolve } from "node:path";

import { HELP, parseArgs } from "./0-args";
import { printViolations, runScan } from "./1-scan";

function main(): void {
    const { fix, help, paths } = parseArgs(process.argv.slice(2));

    if (help) {
        console.log(HELP);
        process.exit(0);
    }

    const scanPaths = paths.length > 0 ? paths.map((p) => resolve(p)) : [resolve(".")];
    const { fileCount, violations, fixedCount } = runScan(scanPaths, { fix });

    if (fix) {
        if (violations.length > 0) {
            printViolations(violations, fileCount);
            process.exit(1);
        }
        process.exit(0);
    }

    printViolations(violations, fileCount);

    if (violations.length > 0) {
        console.log("Run with --fix to reorder classes automatically.\n");
        process.exit(1);
    }

    process.exit(0);
}

main();
