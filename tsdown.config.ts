import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["./src/index.ts", "./src/cli.ts"],
    format: "esm",
    dts: true,
    clean: true,
    target: "node18",
    inputOptions(options) {
        return {
            ...options,
            onLog(level, log, handler) {
                if (log.code === "SOURCEMAP_BROKEN") return;
                handler(level, log);
            },
        };
    },
});
