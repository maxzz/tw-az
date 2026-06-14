#!/usr/bin/env node

import { resolve } from "node:path";

import { printViolations, runScan } from "./scan";

const HELP = `twaz — check and fix Tailwind CSS class order

Usage:
  twaz [options] [paths...]

Options:
  --fix       Reorder classes automatically in place
  --help, -h  Show this help message

Arguments:
  paths       Files or directories to scan (default: current directory)

Examples:
  twaz src
  twaz --fix src/components
  twaz src/App.tsx
`;

function parseArgs(argv: string[]): { fix: boolean; help: boolean; paths: string[] } {
  const paths: string[] = [];
  let fix = false;
  let help = false;

  for (const arg of argv) {
    if (arg === "--fix") {
      fix = true;
    } else if (arg === "--help" || arg === "-h") {
      help = true;
    } else if (!arg.startsWith("-")) {
      paths.push(arg);
    }
  }

  return { fix, help, paths };
}

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
