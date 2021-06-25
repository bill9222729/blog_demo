import { Modal } from 'antd';

export const confirm = () => {
  return new Promise((resolve, reject) => {
    return Modal.confirm({
      title: '內容恢復',
      content: '系統檢測到上一次內容快取，是否恢復該內容？',
      okText: '確認',
      cancelText: '取消',
      onOk: () => {
        resolve(null);
      },
      onCancel: () => {
        reject(new Error('canceld'));
      },
      transitionName: '',
      maskTransitionName: '',
    });
  });
};
