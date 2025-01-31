import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        port: 3000
    },
    resolve: {
        alias: {
            "@components": path.resolve(__dirname, 'src/components'),
            "@context": path.resolve(__dirname, 'src/context'),
            "@styles": path.resolve(__dirname, 'src/styles'),
            "@hooks": path.resolve(__dirname, 'src/hooks'),
        }
    }
})
