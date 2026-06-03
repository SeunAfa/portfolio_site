import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// `base` must match the GitHub Pages project path (https://<user>.github.io/portfolio_site/)
// for production builds; dev server stays at "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/portfolio_site/" : "/",
  plugins: [react(), tailwindcss()],
}));
