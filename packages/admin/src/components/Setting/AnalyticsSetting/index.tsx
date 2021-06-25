import { Form } from '@ant-design/compatible';
import { Button, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { SettingProvider } from '@/providers/setting';

export const AnalyticsSetting = ({ setting }) => {
  const [baiduAnalyticsId, setBaiduAnalyticsId] = useState(null);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(null);

  useEffect(() => {
    setBaiduAnalyticsId((setting && setting.baiduAnalyticsId) || null);
    setGoogleAnalyticsId((setting && setting.googleAnalyticsId) || null);
  }, [setting]);

  const save = () => {
    const data = {
      baiduAnalyticsId,
      googleAnalyticsId,
    };
    SettingProvider.updateSetting(data).then(() => {
      message.success('保存成功');
    });
  };

  return (
    <Form layout="vertical">
      <Form.Item label="百度統計">
        <Input
          placeholder="請輸入百度統計 Id"
          value={baiduAnalyticsId}
          onChange={(e) => {
            setBaiduAnalyticsId(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="Google分析">
        <Input
          placeholder="請輸入Google分析 Id"
          value={googleAnalyticsId}
          onChange={(e) => {
            setGoogleAnalyticsId(e.target.value);
          }}
        />
      </Form.Item>
      <Button type="primary" onClick={save}>
        保存
      </Button>
    </Form>
  );
};
