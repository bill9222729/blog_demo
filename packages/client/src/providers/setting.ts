import { httpProvider } from './http';

export class SettingProvider {
  /**
   * 獲取設置
   */
  static async getSetting(): Promise<ISetting> {
    return httpProvider.post('/setting/get');
  }

  /**
   * 更新設置
   */
  static async updateSetting(data): Promise<ISetting> {
    return httpProvider.post(`/setting`, data);
  }
}
