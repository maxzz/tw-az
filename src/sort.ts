import { classify } from "./classify";
import { GROUP_NAMES, UNKNOWN } from "./constants";
import type { OrderViolation } from "./types";

interface TokenWithMeta {
    token: string;
    sortGroup: number;
    index: number;
}

export function sortClassString(value: string): string {
    const tokens = value.split(/\s+/).filter(Boolean);
    if (tokens.length < 2) {
        return value;
    }

    const withMeta: TokenWithMeta[] = tokens.map((token, index) => ({
        token,
        sortGroup: classify(token),
        index,
    }));

    withMeta.sort((a, b) => {
        const ga = a.sortGroup >= 0 ? a.sortGroup : UNKNOWN;
        const gb = b.sortGroup >= 0 ? b.sortGroup : UNKNOWN;
        if (ga !== gb) {
            return ga - gb;
        }
        return a.index - b.index;
    });

    return withMeta.map((x) => x.token).join(" ");
}

export function checkClassString(value: string): OrderViolation[] {
    const tokens = value.split(/\s+/).filter(Boolean);
    const classified = tokens
        .map((token) => ({ token, group: classify(token) }))
        .filter((x) => x.group >= 0);

    const violations: OrderViolation[] = [];
    let maxGroup = -1;

    for (const { token, group } of classified) {
        if (group < maxGroup) {
            violations.push({
                token,
                group: GROUP_NAMES[group] ?? `group ${group}`,
                after: GROUP_NAMES[maxGroup] ?? `group ${maxGroup}`,
            });
        }
        maxGroup = Math.max(maxGroup, group);
    }

    return violations;
}
