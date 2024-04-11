/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    include: ['./app/**/*.test.{ts,tsx}'],
    environment: 'happy-dom',
    restoreMocks: true,
    setupFiles: ['./tests/setup-test-env.ts']
  }
});
