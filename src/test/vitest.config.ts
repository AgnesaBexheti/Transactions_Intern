import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import '@testing-library/jest-dom';


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' }   // lets you use '@/...' in tests
  },
  test: {
    environment: 'jsdom',
    globals: true,                       // so describe/test/expect/vi are globals
    setupFiles: './test/setupTests.ts',
    include: ['tests/**/*.test.{ts,tsx}']
  }
});



