import { httpProvider } from './http';

export class PageProvider {
  /**
   * 獲取所有頁面
   */
  static async getPages(params): Promise<[IPage[], number]> {
    return httpProvider.get('/page', { params: params });
  }

  /**
   * 獲取所有已發布頁面
   */
  static async getAllPublisedPages(): Promise<[IPage[], number]> {
    return httpProvider.get('/page', { params: { status: 'publish' } }).then((res) => {
      return [res[0].sort((a, b) => -a.order + b.order), res[1]];
    });
  }

  /**
   * 獲取指定頁面
   * @param id
   */
  static async getPage(id): Promise<IPage> {
    return httpProvider.get(`/page/${id}`);
  }

  /**
   * 新建頁面
   * @param data
   */
  static async addPage(data): Promise<IPage> {
    return httpProvider.post('/page', data);
  }

  /**
   * 更新頁面
   * @param id
   * @param data
   */
  static async updatePage(id, data): Promise<IPage> {
    return httpProvider.patch(`/page/${id}`, data);
  }

  /**
   * 更新文章閱讀量
   * @param id
   * @param data
   */
  static async updatePageViews(id): Promise<IPage> {
    return httpProvider.post(`/page/${id}/views`);
  }

  /**
   * 刪除頁面
   * @param id
   */
  static async deletePage(id): Promise<IPage> {
    return httpProvider.delete(`/page/${id}`);
  }
}
