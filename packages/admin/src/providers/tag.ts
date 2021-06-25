import { httpProvider } from './http';

export class TagProvider {
  /**
   * 獲取所有標籤
   */
  static async getTags(): Promise<ITag[]> {
    return httpProvider.get('/tag');
  }

  /**
   * 獲取指定標籤下文章
   * @param id
   */
  static async getTagWithArticles(id, needFilter = false): Promise<ITag> {
    return httpProvider.get(
      `/tag/${id}/article`,
      needFilter
        ? {
            params: { status: 'publish' },
          }
        : {}
    );
  }

  /**
   * 添加標籤
   * @param data
   */
  static async addTag(data): Promise<ITag> {
    return httpProvider.post('/tag', data);
  }

  /**
   * 更新標籤
   * @param id
   * @param data
   */
  static async updateTag(id, data): Promise<ITag> {
    return httpProvider.patch(`/tag/${id}`, data);
  }

  /**
   * 刪除標籤
   * @param id
   */
  static async deleteTag(id): Promise<ITag> {
    return httpProvider.delete(`/tag/${id}`);
  }
}
