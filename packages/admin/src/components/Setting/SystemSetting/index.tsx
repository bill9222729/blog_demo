import { Form } from '@ant-design/compatible';
import { FileImageOutlined } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { FileSelectDrawer } from '@/components/FileSelectDrawer';
import { SettingProvider } from '@/providers/setting';

export const SystemSetting = ({ setting }) => {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState('logo');
  const [systemUrl, setSystemUrl] = useState(null);
  const [systemTitle, setSystemTitle] = useState(null);
  const [systemBg, setSystemBg] = useState(null);
  const [systemLogo, setSystemLogo] = useState(null);
  const [systemFavicon, setSystemFavicon] = useState(null);
  const [systemFooterInfo, setSystemFooterInfo] = useState(null);
  const [adminSystemUrl, setAdminSystemUrl] = useState(null);

  useEffect(() => {
    setSystemUrl((setting && setting.systemUrl) || null);
    setSystemTitle((setting && setting.systemTitle) || null);
    setSystemBg((setting && setting.systemBg) || null);
    setSystemLogo((setting && setting.systemLogo) || null);
    setSystemFavicon((setting && setting.systemFavicon) || null);
    setSystemFooterInfo((setting && setting.systemFooterInfo) || null);
    setAdminSystemUrl((setting && setting.adminSystemUrl) || null);
  }, [setting]);

  const save = () => {
    const data = {
      systemUrl,
      systemTitle,
      systemBg,
      systemLogo,
      systemFavicon,
      systemFooterInfo,
      adminSystemUrl,
    };
    SettingProvider.updateSetting(data).then(() => {
      message.success('保存成功');
    });
  };

  return (
    <Form layout="vertical">
      <Form.Item label="系統地址">
        <Input
          placeholder="請輸入系統地址"
          value={systemUrl}
          onChange={(e) => {
            setSystemUrl(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="後台地址">
        <Input
          placeholder="請輸入後台地址"
          value={adminSystemUrl}
          onChange={(e) => {
            setAdminSystemUrl(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="系統標題">
        <Input
          placeholder="請輸入系統標題，將作為 head.title 顯示"
          value={systemTitle}
          onChange={(e) => {
            setSystemTitle(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="全局背景">
        <Input
          placeholder="請輸入全局背景連結或選擇文件"
          addonAfter={
            <FileImageOutlined
              onClick={() => {
                setMode('bg');
                setVisible(true);
              }}
            />
          }
          value={systemBg}
          onChange={(e) => {
            setSystemBg(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="Logo">
        <Input
          placeholder="請輸入 logo 連結或選擇文件，也可輸入 html"
          addonAfter={
            <FileImageOutlined
              onClick={() => {
                setMode('logo');
                setVisible(true);
              }}
            />
          }
          value={systemLogo}
          onChange={(e) => {
            setSystemLogo(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="Favicon">
        <Input
          placeholder="請輸入 favicon 連結或選擇文件"
          addonAfter={
            <FileImageOutlined
              onClick={() => {
                setMode('favicon');
                setVisible(true);
              }}
            />
          }
          value={systemFavicon}
          onChange={(e) => {
            setSystemFavicon(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="頁尾訊息">
        <Input.TextArea
          placeholder="請輸入頁尾訊息"
          rows={8}
          value={systemFooterInfo}
          onChange={(e) => {
            setSystemFooterInfo(e.target.value);
          }}
        />
      </Form.Item>
      <FileSelectDrawer
        visible={visible}
        closeAfterClick={true}
        onClose={() => setVisible(false)}
        onChange={(url) => {
          if (mode === 'logo') {
            setSystemLogo(url);
          } else if (mode === 'bg') {
            setSystemBg(url);
          } else {
            setSystemFavicon(url);
          }
        }}
      />
      <Button type="primary" onClick={save}>
        保存
      </Button>
    </Form>
  );
};
