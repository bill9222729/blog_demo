import { httpProvider } from './http';

export class CategoryProvider {
  /**
   * 獲取所有標籤
   */
  static async getCategory(): Promise<ICategory[]> {
    return httpProvider.get('/category');
  }

  /**
   * 添加標籤
   * @param data
   */
  static async add(data): Promise<ICategory> {
    return httpProvider.post('/category', data);
  }

  /**
   * 更新標籤
   * @param id
   * @param data
   */
  static async update(id, data): Promise<ICategory> {
    return httpProvider.patch(`/category/${id}`, data);
  }

  /**
   * 刪除標籤
   * @param id
   */
  static async delete(id): Promise<ICategory> {
    return httpProvider.delete(`/category/${id}`);
  }
}
