import { HttpException, HttpStatus } from '@nestjs/common';

import { SettingService } from '../modules/setting/setting.service';
import { AliyunOssClient } from './oss/aliyun-oss-client';
import { OssClient } from './oss/oss-client';

export class Oss {
  settingService: SettingService;
  config: Record<string, unknown>;
  ossClient: OssClient;

  constructor(settingService: SettingService) {
    this.settingService = settingService;
  }

  private async getConfig() {
    const data = await this.settingService.findAll(true);
    const config = JSON.parse(data.oss);
    if (!config) {
      throw new HttpException('OSS 配置不完善，無法進行操作', HttpStatus.BAD_REQUEST);
    }
    return config as Record<string, unknown>;
  }

  private async getOssClient() {
    const config = await this.getConfig();
    const type = String(config.type).toLowerCase();

    switch (type) {
      case 'aliyun':
      default:
        return new AliyunOssClient(config);
    }
  }

  async putFile(filepath: string, buffer: ReadableStream) {
    const client = await this.getOssClient();
    const url = await client.putFile(filepath, buffer);
    return url;
  }

  async deleteFile(url: string) {
    const client = await this.getOssClient();
    await client.deleteFile(url);
  }
}
