const { config } = require('@wipi/config');
const cli = require('next/dist/cli/next-start');

const port = config.ADMIN_PORT || 3002;

try {
  cli.nextStart(['-p', port]);
  console.log(`[wipi] 管理端已啟動，埠：${port}`);
} catch (err) {
  console.log(`[wipi] 管理端啟動失敗！${err.message || err}`);
}
