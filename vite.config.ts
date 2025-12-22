import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                'firebase-messaging-sw': './public/firebase-messaging-sw.js',
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    // Output service worker in root
                    if (chunkInfo.name === 'firebase-messaging-sw') {
                        return '[name].js';
                    }
                    return 'assets/[name]-[hash].js';
                },
            },
        },
    },
});