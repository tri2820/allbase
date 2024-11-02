import { defineConfig } from "@solidjs/start/config";
import path from 'path';
import { Plugin } from "vinxi/dist/types/lib/vite-dev";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { build } from 'vite'; // Import the build function from Vite

// Compile the service worker using Vite's build process
const compileServiceWorker = async (): Promise<void> => {
    console.log('Compiling TypeScript Service Worker...');
    try {
        await build({
            // Specify the build options for the service worker
            build: {
                rollupOptions: {
                    input: path.resolve('./src/service-worker.ts'),
                    output: {
                        // Specify the output directory
                        dir: path.resolve('./public'), // Output directory
                        // Use entryFileNames to define the output file name
                        entryFileNames: 'service-worker.js', // Output file name
                    },
                },
                // This option ensures that polyfills are included
                lib: {
                    entry: path.resolve('./src/service-worker.ts'),
                    name: 'ServiceWorker',
                    formats: ['iife'], // Use the IIFE format for the service worker
                },
            },
            plugins: [
                nodePolyfills(), // Add polyfills for Node.js core modules
            ],
        });
        console.log('Service worker compiled successfully with polyfills.');
    } catch (error) {
        console.error('Error compiling service worker:', error);
    }
};

const CompileTsServiceWorkerPlugin: Plugin = {
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
};

export default defineConfig({
    vite: {
        plugins: [
            nodePolyfills(),
            CompileTsServiceWorkerPlugin,
        ],
    },
});
