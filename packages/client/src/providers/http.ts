import { message } from 'antd';
import axios, { AxiosResponse } from 'axios';

export const httpProvider = axios.create({
  baseURL: process.env.SERVER_API_URL,
  timeout: 60000,
});

const isBrowser = typeof window !== 'undefined';

httpProvider.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const token = window.localStorage.getItem('token');
      if (config && config.headers && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  () => {
    throw new Error('發起請求出錯');
  }
);

httpProvider.interceptors.response.use(
  (
    data: AxiosResponse<{
      statusCode: number;
      success: boolean;
      msg: string | null;
      data: unknown;
    }>
  ) => {
    const res = data.data;

    if (!res.success) {
      message.error(res.msg);
      return null;
    }
    return res.data;
  },
  (err) => {
    if (err && err.response && err.response.status) {
      const status = err.response.status;

      switch (status) {
        case 400:
        case 404:
        case 504:
          isBrowser && message.error((err.response && err.response.data && err.response.data.msg) || '伺服器異常');
          break;

        default:
          isBrowser && message.error((err.response && err.response.data && err.response.data.msg) || '未知錯誤!');
          break;
      }
      return Promise.reject({
        statusCode: err.response.status,
        message: err.response.data.msg,
      });
    }

    return Promise.reject(err);
  }
);
