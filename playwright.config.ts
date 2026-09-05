import { defineConfig, devices } from '@playwright/test'

const PORTA = 4173
const URL = `http://127.0.0.1:${PORTA}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: URL,
    // fixa a língua inicial: o site escolhe a partir do navigator.language
    locale: 'en-US',
    // os componentes respeitam useReducedMotion, logo isto assenta o conteúdo
    // no estado final em vez de o apanhar a meio da entrada
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // --host explícito: sem ele o vite liga-se a "localhost", que num runner do
    // GitHub resolve primeiro para ::1 e deixa o 127.0.0.1 sem ninguém a ouvir
    command: `npm run preview -- --host 127.0.0.1 --port ${PORTA} --strictPort`,
    url: URL,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
