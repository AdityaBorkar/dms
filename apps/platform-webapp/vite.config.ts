import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  envPrefix: ["PUBLIC_"],
  plugins: [devtools(), nitro(), tailwindcss(), tanstackStart(), viteReact()],
  resolve: {
    preserveSymlinks: true,
    tsconfigPaths: true,
  },
  // optimizeDeps: {
  //   exclude: ["@aspen-os/platform"],
  // },
  // ssr: {
  //   external: ["@aspen-os/platform"],
  // },
});

export default config;
