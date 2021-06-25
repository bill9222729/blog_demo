import { InboxOutlined } from '@ant-design/icons';
import { message, Spin, Upload as AntdUpload } from 'antd';
import React, { useState } from 'react';

import { FileProvider } from '@/providers/file';

export const Upload = ({ onChange = null, onOK = null, style = {}, useDragger = true, children = null }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const uploadProps = {
    name: 'file',
    multiple: true,
    action: '',
    showUploadList: false,
    beforeUpload(file) {
      setLoading(true);
      FileProvider.uploadFile(file)
        .then((res) => {
          setLoading(false);
          message.success('上傳成功');
          onChange && onChange(res.url);
          onOK && onOK();
        })
        .catch(() => {
          setLoading(false);
        });
      return Promise.reject(new Error('cancel'));
    },
  };

  const Wrap = useDragger ? AntdUpload.Dragger : AntdUpload;

  return (
    <Spin tip="文件上傳中..." spinning={loading}>
      <Wrap {...uploadProps} style={style}>
        {children || (
          <>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">點擊選擇文件或將文件拖拽到此處</p>
            <p className="ant-upload-hint">文件將上傳到 OSS, 如未配置請先配置</p>
          </>
        )}
      </Wrap>
    </Spin>
  );
};
