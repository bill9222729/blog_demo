const { config } = require('@wipi/config');
const cli = require('next/dist/cli/next-dev');

const port = config.ADMIN_PORT || 3002;

try {
  cli.nextDev(['-p', port]);
  console.log(`[wipi] 管理端已啟動，埠：${port}`);
} catch (err) {
  console.log(`[wipi] 管理端啟動失敗！${err.message || err}`);
}
