import { httpProvider } from './http';

export class FileProvider {
  /**
   * 上傳文件
   * @param file
   */
  static async uploadFile(file, unique = 0): Promise<IFile> {
    const formData = new FormData();
    formData.append('file', file);

    return httpProvider.post('/file/upload?unique=' + unique, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * 獲取指定文件
   */
  static async getFiles(params): Promise<[IFile[], number]> {
    return httpProvider.get('/file', { params });
  }

  /**
   * 刪除文件
   * @param id
   */
  static async deleteFile(id): Promise<IFile> {
    return httpProvider.delete(`/file/${id}`);
  }
}
