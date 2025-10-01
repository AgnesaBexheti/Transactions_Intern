import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    // 👇 this file must exist — see step (2)
    setupFiles: './src/test/setupTests.ts',
    include: ['src/test/**/*.test.{ts,tsx}'],
  },
});
