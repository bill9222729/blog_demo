import { httpProvider } from './http';

export class SMTPProvider {
  /**
   * 上傳文件
   * @param file
   */
  static async testSendMail(user): Promise<IFile> {
    return httpProvider.post('/smtp', {
      to: user,
      subject: '測試',
      text: '測試郵件',
    });
  }
}
