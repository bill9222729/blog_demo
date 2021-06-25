import { httpProvider } from './http';

export class KnowledgeProvider {
  /**
   * 創建知識庫
   * @param data
   */
  static createBook(data): Promise<IKnowledge> {
    return httpProvider.post('/knowledge/book', data);
  }

  /**
   * 創建知識庫章節
   * @param data
   */
  static createChapters(data): Promise<Array<IKnowledge>> {
    return httpProvider.post('/knowledge/chapter', data);
  }

  /**
   * 刪除文章
   * @param id
   */
  static async deleteKnowledge(id): Promise<IKnowledge> {
    return httpProvider.delete(`/knowledge/${id}`);
  }

  /**
   * 更新文章
   * @param id
   * @param data
   */
  static async updateKnowledge(id, data): Promise<IKnowledge> {
    return httpProvider.patch(`/knowledge/${id}`, data);
  }

  /**
   * 獲取所有知識庫（不包含章節）
   */
  static async getKnowledges(params = {}): Promise<[IKnowledge[], number]> {
    return httpProvider.get('/knowledge', { params });
  }

  /**
   * 獲取知識詳情（如果是知識庫，包含所有章節）
   * @param id
   */
  static async getKnowledge(id): Promise<IKnowledge> {
    return httpProvider.get(`/knowledge/${id}`);
  }

  /**
   * 更新知識閱讀量
   * @param id
   * @param data
   */
  static async updateKnowledgeViews(id): Promise<IKnowledge> {
    return httpProvider.post(`/knowledge/${id}/views`);
  }
}
