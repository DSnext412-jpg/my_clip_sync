import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";
var __dirname = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5173,
        proxy: {
            "/socket.io": {
                target: "http://localhost:3001",
                ws: true,
            },
        },
    },
});
