import { httpProvider } from './http';

export class ViewProvider {
  /**
   * 獲取所有訪問
   */
  static async getViews(params): Promise<[IView[], number]> {
    return httpProvider.get('/view', { params });
  }

  /**
   * 添加訪問
   * @param data
   */
  static async addView(data): Promise<IView> {
    return httpProvider.post('/view', data);
  }

  static async getViewsByUrl(url): Promise<IView[]> {
    return httpProvider.get('/view/url', { params: { url } });
  }

  static async deleteView(id): Promise<IView> {
    return httpProvider.delete('/view/' + id);
  }
}
