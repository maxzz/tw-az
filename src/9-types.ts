// Scan options

export interface ScanOptions {
    extensions?: string[];
    fix?: boolean;
}

// Class string matches

export interface ClassMatch {
    value: string;
    index: number;
    length: number;
    full: string;
}

// Order violations

export interface OrderViolation {
    token: string;
    group: string;
    after: string;
}

// File violations

export interface FileViolation {
    file: string;
    line: number;
    value: string;
    violations: OrderViolation[];
}

// Fix replacements

export interface FixReplacement {
    index: number;
    length: number;
    replacement: string;
}
