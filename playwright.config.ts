import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './apps/web/e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  webServer: [
    {
      command: 'npm run dev:api',
      url: 'http://localhost:4000/api/health',
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        PGHOST: process.env.PGHOST ?? 'localhost',
        PGPORT: process.env.PGPORT ?? '3838',
        PGUSER: process.env.PGUSER ?? 'react_dex_user',
        PGPASSWORD: process.env.PGPASSWORD ?? 'react_dex_password',
        PGDATABASE: process.env.PGDATABASE ?? 'react_dex'
      }
    },
    {
      command: 'npm run dev:web',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 120_000
    }
  ]
});
