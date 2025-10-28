export default {
  testDir: './__tests__',
  timeout: 10000,
  use: {
    baseURL: 'http://127.0.0.1:5002',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
  },
  workers: 1,
  reporter: [['list']],
  chromiumSandbox: false,
}
