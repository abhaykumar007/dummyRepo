import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import EnvironmentPlugin from "vite-plugin-environment";

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: "prompt",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    name: "Growloc",
    short_name: "Growloc",
    description:
      "We provide Farm to Business linkage services, by using technology to enable modern controlled farms easy and customised growing according to your requirements.",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "/maskable_icon.png",
        sizes: "225x225",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#171717",
    background_color: "#e8ebf2",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // VitePWA(manifestForPlugin),
    EnvironmentPlugin([
      "VITE_COGNITO_POOL_ID",
      "VITE_COGNITO_CLIENT_ID",
      "VITE_BASE_URL",
    ]),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
  define: {
    global: {},
  },

  // build: {
  //   rollupOptions: {
  //     output: {
  //       entryFileNames:
  //         `assets/[name]` + Math.floor(Math.random() * 90000) + 10000 + `.js`,
  //       chunkFileNames:
  //         `assets/[name]` + Math.floor(Math.random() * 90000) + 10000 + `.js`,
  //       assetFileNames:
  //         `assets/[name]` +
  //         Math.floor(Math.random() * 90000) +
  //         10000 +
  //         `.[ext]`,
  //     },
  //   },
  // },

  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id: any) {
  //         if (id.includes("node_modules")) {
  //           return id
  //             .toString()
  //             .split("node_modules/")[1]
  //             .split("/")[0]
  //             .toString();
  //         }
  //       },

  //       manualChunks(id: any) {
  //         if (id.includes("node_modules")) {
  //           if (id.includes("react") || id.includes("react-dom")) {
  //             return "react";
  //           }
  //           if (id.includes("rc-util")) {
  //             return "rc-util";
  //           }
  //           return id
  //             .toString()
  //             .split("node_modules/")[1]
  //             .split("/")[0]
  //             .toString();
  //         }
  //       },
  //     },
  //   },
  // },
});
