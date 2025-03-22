import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Use the JS implementation as fallback if native bindings fail
      useAtYourOwnRisk_mutateSwcOptions(options) {
        if (!options.jsc) options.jsc = {};
        options.jsc.externalHelpers = false;
      },
    }),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api/generate-alt-text": {
        target: "http://localhost:8787", // Assuming the Cloudflare worker runs on this port locally
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/generate-alt-text/, ""),
      },
    },
  },
});
