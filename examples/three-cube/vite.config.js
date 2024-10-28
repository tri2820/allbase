import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    outDir: 'dist', // Output directory
    rollupOptions: {
      output: {
        dir: 'dist', // Specify output directory
        entryFileNames: 'main.js', // Name of the output file
        format: 'iife', // Use IIFE format for a single output file
      },
      // Customize input if you have multiple entry points
      input: './src/main.ts', // Path to your main entry file
    },
    cssCodeSplit: false, // Prevent generating separate CSS files
    assetsInlineLimit: 0, // Prevent inlining of assets
  },
});