import { httpProvider } from './http';

export class UserProvider {
  /**
   * 用戶登錄
   * @param data
   */
  static async login(data): Promise<IUser> {
    return httpProvider.post('/auth/login', data);
  }

  static async checkAdmin(data): Promise<IUser> {
    return httpProvider.post('/auth/admin', data);
  }

  static async loginWithGithub(code): Promise<IUser> {
    return httpProvider.post('/auth/github', { code });
  }

  /**
   * 用戶註冊
   * @param data
   */
  static async register(data): Promise<IUser> {
    return httpProvider.post('/user/register', data);
  }

  /**
   * 獲取用戶
   * @param params
   */
  static getUsers(params): Promise<[IUser[], number]> {
    return httpProvider.get('/user', { params });
  }

  /**
   * 更新用戶訊息
   * @param data
   */
  static async update(data): Promise<IUser> {
    return httpProvider.post('/user/update', data);
  }

  /**
   * 更新用戶密碼
   * @param data
   */
  static async updatePassword(data): Promise<IUser> {
    return httpProvider.post('/user/password', data);
  }
}
