import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";

const aliases = [{ find: "components", replacement: "src/components" }];

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 4000,
  },
  resolve: {
    alias: aliases.map((alias) => ({
      ...alias,
      replacement: path.resolve(__dirname, alias.replacement),
    })),
  },
});
