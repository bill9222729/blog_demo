const { config } = require('@wipi/config');
const cli = require('next/dist/cli/next-dev');

const port = config.CLIENT_PORT || 3001;

try {
  cli.nextDev(['-p', port]);
  console.log(`[wipi] 用戶端已啟動，埠：${port}`);
} catch (err) {
  console.log(`[wipi] 用戶端啟動失敗！${err.message || err}`);
}
