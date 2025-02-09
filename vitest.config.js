import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'src/__test__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.tsx'],
      exclude: [
        '**/node_modules/**',
        '**/*.test.{ts,tsx}',
        'src/__tests__/setup.ts',
        'src/App.tsx',
      ],
    },
  },
});
