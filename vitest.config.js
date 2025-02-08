import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // ensure a DOM environment is used
    setupFiles: ['src/setupTests.ts'], // for jest-dom matchers, if needed
    // Include both patterns for tests in src/**/.test.tsx and src/__test__/**.test.tsx
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
