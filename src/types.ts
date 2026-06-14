export interface ClassMatch {
    value: string;
    index: number;
    length: number;
    full: string;
}

export interface OrderViolation {
    token: string;
    group: string;
    after: string;
}

export interface FileViolation {
    file: string;
    line: number;
    value: string;
    violations: OrderViolation[];
}

export interface FixReplacement {
    index: number;
    length: number;
    replacement: string;
}

export interface ScanOptions {
    extensions?: string[];
    fix?: boolean;
}
