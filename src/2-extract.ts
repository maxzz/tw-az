import { CLASS_PATTERNS } from "./8-constants";
import type { ClassMatch } from "./9-types";

export function extractClassStrings(content: string): ClassMatch[] {
    const results: ClassMatch[] = [];
    const seen = new Set<string>();

    for (const pattern of CLASS_PATTERNS) {
        const re = new RegExp(pattern.source, pattern.flags);
        let match: RegExpExecArray | null;

        while ((match = re.exec(content)) !== null) {
            const captured = match[1];
            if (captured === undefined) {
                continue;
            }

            const key = `${match.index}:${match[0].length}`;
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);

            results.push({
                value: captured,
                index: match.index,
                length: match[0].length,
                full: match[0],
            });
        }
    }

    return results;
}
