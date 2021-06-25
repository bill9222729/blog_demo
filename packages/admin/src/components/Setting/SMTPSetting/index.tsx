import { Form } from '@ant-design/compatible';
import { Button, Input, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { SettingProvider } from '@/providers/setting';
import { SMTPProvider } from '@/providers/smtp';

export const SMTPSetting = ({ setting }) => {
  const [smtpHost, setsmtpHost] = useState(null);
  const [smtpPort, setsmtpPort] = useState(null);
  const [smtpUser, setsmtpUser] = useState(null);
  const [smtpPass, setsmtpPass] = useState(null);
  const [smtpFromUser, setSmtpFromUser] = useState(null);

  useEffect(() => {
    setsmtpHost((setting && setting.smtpHost) || null);
    setsmtpPort((setting && setting.smtpPort) || null);
    setsmtpUser((setting && setting.smtpUser) || null);
    setsmtpPass((setting && setting.smtpPass) || null);
    setSmtpFromUser((setting && setting.smtpFromUser) || null);
  }, [setting]);

  const save = () => {
    const data = {
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      smtpFromUser,
    };
    SettingProvider.updateSetting(data).then(() => {
      message.success('保存成功');
    });
  };

  const test = useCallback(() => {
    SMTPProvider.testSendMail(smtpFromUser)
      .then(() => {
        message.success('郵件發送成功');
      })
      .catch(() => {
        message.error('郵件發送失敗');
      });
  }, [smtpFromUser]);

  return (
    <Form layout="vertical">
      <Form.Item label="SMTP 地址">
        <Input
          placeholder="請輸入SMTP"
          value={smtpHost}
          onChange={(e) => {
            setsmtpHost(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="SMTP 埠（強制使用 SSL 連接）">
        <Input
          placeholder="請輸入SMTP 埠"
          value={smtpPort}
          onChange={(e) => {
            setsmtpPort(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="SMTP 用戶">
        <Input
          placeholder="請輸入SMTP 用戶"
          value={smtpUser}
          onChange={(e) => {
            setsmtpUser(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="SMTP 密碼">
        <Input
          placeholder="也可能是授權碼"
          value={smtpPass}
          onChange={(e) => {
            setsmtpPass(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item label="發件人">
        <Input
          placeholder="請輸入正確的信箱地址"
          value={smtpFromUser}
          onChange={(e) => {
            setSmtpFromUser(e.target.value);
          }}
        />
      </Form.Item>
      <Button type="primary" onClick={save}>
        保存
      </Button>
      <Button style={{ marginLeft: 16 }} onClick={test}>
        測試
      </Button>
    </Form>
  );
};
