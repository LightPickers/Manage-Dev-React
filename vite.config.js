/* eslint-env node */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import svgr from "vite-plugin-svgr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_ADMIN_APP_BASE,
    plugins: [
      react(),
      svgr(),
      eslint({
        include: ["src/**/*.{js,jsx,ts,tsx}"],
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@pages": resolve(__dirname, "./src/pages"),
        "@components": resolve(__dirname, "./src/components"),
        "@layouts": resolve(__dirname, "./src/layouts"),
        "@routes": resolve(__dirname, "./src/routes"),
        "@assets": resolve(__dirname, "./src/assets"),
        "@features": resolve(__dirname, "./src/features"),
        "@hooks": resolve(__dirname, "./src/hooks"),
        "@schemas": resolve(__dirname, "./src/schemas"),
        "@utils": resolve(__dirname, "./src/utils"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [resolve(__dirname, "src/assets")],
        },
      },
    },
  };
});
