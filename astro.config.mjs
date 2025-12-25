// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  markdown: {
      shikiConfig: {
          theme: "catppuccin-macchiato",
      },
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: "Monaspace Neon",
        cssVariable: "--font-monaspace-neon",
        weights: [400, 500, 700],
        styles: ["normal", "italic"],
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
