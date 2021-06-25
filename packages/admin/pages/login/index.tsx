import { Form } from '@ant-design/compatible';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { Button, Col, Input, Row } from 'antd';
import Link from 'next/link';
import { default as Router } from 'next/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import { Svg } from '@/assets/LoginSvg';
import { GlobalContext } from '@/context/global';
import { UserProvider } from '@/providers/user';

import style from './index.module.scss';

type ILoginProps = FormComponentProps;

const _Login: React.FC<ILoginProps> = ({ form }) => {
  const { getFieldDecorator } = form;
  const globalContext = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const submit = useCallback(
    (e) => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          setLoading(true);
          UserProvider.login(values)
            .then((userInfo) => {
              localStorage.setItem('token', userInfo.token);
              setLoading(false);
              globalContext.setUser(userInfo);
              globalContext.getSetting();
              Router.push((Router.query.redirect as string) || '/');
            })
            .catch(() => setLoading(false));
        }
      });
    },
    [form, globalContext]
  );

  return (
    <div className={style.wrapper}>
      <Helmet>
        <title>系統登錄</title>
      </Helmet>
      <Row className={style.container}>
        <Col xs={0} sm={0} md={12}>
          <Svg />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <div style={{ width: '100%' }}>
            <h2>系統登錄</h2>
            <Form layout="horizontal" onSubmit={submit}>
              <Form.Item label="帳戶">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '請輸入使用者名稱！' }],
                })(<Input placeholder="請輸入使用者名稱" />)}
              </Form.Item>
              <Form.Item label="密碼">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '請輸入密碼！' }],
                })(<Input type="password" placeholder="請輸入密碼" />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading} disabled={loading}>
                  登錄
                </Button>
                Or{' '}
                <Link href="/register">
                  <a>註冊用戶</a>
                </Link>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
      <ul className={style.bubbles}>
        {Array.from({ length: 10 }).map((_, idx) => (
          <li key={idx}></li>
        ))}
      </ul>
    </div>
  );
};

export default Form.create<ILoginProps>({ name: 'login' })(_Login);
