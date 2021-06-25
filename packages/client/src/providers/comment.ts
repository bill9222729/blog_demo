import { httpProvider } from './http';

export class CommentProvider {
  /**
   * 獲取所有評論
   */
  static async getComments(params): Promise<[IComment[], number]> {
    return httpProvider.get('/comment', { params });
  }

  /**
   * 獲取指定評論
   * @param id
   */
  static async getComment(id): Promise<IComment> {
    return httpProvider.get(`/comment/${id}`);
  }

  /**
   * 獲取指定文章評論
   * @param hostId
   */
  static async getArticleComments(hostId, params): Promise<[IComment[], number]> {
    return httpProvider.get(`/comment/host/${hostId}`, { params });
  }

  /**
   * 添加評論
   * @param data
   */
  static async addComment(data): Promise<IComment> {
    return httpProvider.post('/comment', data);
  }

  /**
   * 更新評論
   * @param id
   * @param data
   */
  static async updateComment(id, data): Promise<IComment> {
    return httpProvider.patch(`/comment/${id}`, data);
  }

  /**
   * 刪除評論
   * @param id
   */
  static async deleteComment(id): Promise<IComment> {
    return httpProvider.delete(`/comment/${id}`);
  }
}
