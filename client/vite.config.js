
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  // byteXL preview uses the proxy; production uses the root path.
  base: command === "serve" ? "/proxy/5173/" : "/",

  plugins: [react()],

  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,

    origin: "https://6c39334b5c56-0af42d38-5300.ws6.app",

    hmr: {
      clientPort: 443,
      protocol: "wss",
    },

    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
}));
