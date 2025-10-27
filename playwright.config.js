export default {
  testDir: './__tests__',
  timeout: 10000,
  use: {
    baseURL: 'http://localhost:5002',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
  },
  webServer: {
    command: 'make dev',
    port: 5002,
    reuseExistingServer: true,
  },
  workers: 1,
  reporter: [['list']],
  chromiumSandbox: false,
}
