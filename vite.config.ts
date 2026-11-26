import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative asset paths so dist/ works from any base path (Vercel root, previews, local file).
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Phaser is large and changes rarely; a separate chunk lets browsers cache it across deploys.
        manualChunks: (id) => (id.includes('node_modules/phaser') ? 'phaser' : undefined),
      },
    },
    // Phaser alone exceeds Vite's default 500 kB warning; that is expected, not a regression.
    chunkSizeWarningLimit: 2000,
  },
  test: {
    // Game logic is pure TypeScript, so no DOM environment is needed.
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
  },
});
