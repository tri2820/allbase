import { defineConfig } from "@solidjs/start/config";
import { build } from 'esbuild';
import path from 'path';
import { Plugin } from "vinxi/dist/types/lib/vite-dev";

const compileServiceWorker = async () => {
    console.log('Compiling TypeScript Service Worker...');
    try {
        await build({
            entryPoints: ['./src/service-worker.ts'],
            bundle: true,
            outfile: path.resolve('./public/service-worker.js'), // Adjust output path
        });
        console.log('Service worker compiled successfully.');
    } catch (error) {
        console.error('Error compiling service worker:', error);
    }
};

const CompileTsServiceWorkerPlugin: Plugin = ({
    name: 'compile-typescript-service-worker',
    async buildStart() {
        // Compile the service worker at the start of the build
        await compileServiceWorker();
    },
    async handleHotUpdate({ file }) {
        // Only watch the service worker file
        if (file.endsWith('service-worker.ts')) {
            console.log('Rebuilding TypeScript Service Worker...');
            await compileServiceWorker();
        }
    },
});

export default defineConfig({
    vite: {
        plugins: [
            CompileTsServiceWorkerPlugin
        ]
    }
});
