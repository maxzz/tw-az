export const HELP = `twaz — check and fix Tailwind CSS class order

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

export function parseArgs(argv: string[]): { fix: boolean; help: boolean; paths: string[]; } {
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
