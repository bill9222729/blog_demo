import { httpProvider } from './http';

export class MailProvider {
  /**
   * 獲取所有郵件
   */
  static async getMails(params): Promise<[IMail[], number]> {
    return httpProvider.get('/smtp', { params });
  }

  static async deleteMail(id): Promise<IMail> {
    return httpProvider.delete('/smtp/' + id);
  }
}
