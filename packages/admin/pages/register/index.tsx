import { Form } from '@ant-design/compatible';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { Button, Col, Input, Modal, Row } from 'antd';
import Link from 'next/link';
import { default as Router } from 'next/router';
import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';

import { Svg } from '@/assets/RegisterSvg';
import { UserProvider } from '@/providers/user';

import style from './index.module.scss';

type IProps = FormComponentProps;

const _Register: React.FC<IProps> = ({ form }) => {
  const { getFieldDecorator } = form;
  const [loading, setLoading] = useState(false);

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('兩次密碼不一致');
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    if (value) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  const submit = useCallback(
    (e) => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          setLoading(true);
          UserProvider.register(values)
            .then(() => {
              Modal.confirm({
                title: '註冊成功',
                content: '是否跳轉至登錄?',
                okText: '確認',
                cancelText: '取消',
                onOk() {
                  Router.push('/login');
                },
                onCancel() {
                  console.log('Cancel');
                },
                transitionName: '',
                maskTransitionName: '',
              });
            })
            .catch(() => setLoading(false));
        }
      });
    },
    [form]
  );

  return (
    <div className={style.wrapper}>
      <Helmet>
        <title>訪客註冊</title>
      </Helmet>
      <Row className={style.container}>
        <Col xs={0} sm={0} md={12}>
          <Svg />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <div style={{ width: '100%' }}>
            <h2>訪客註冊</h2>
            <Form layout="horizontal" onSubmit={submit}>
              <Form.Item label="帳戶">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '請輸入使用者名稱！' }],
                })(<Input autoComplete={'off'} placeholder="請輸入使用者名稱" />)}
              </Form.Item>
              <Form.Item label="密碼">
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '請輸入密碼！' },

                    {
                      validator: validateToNextPassword,
                    },
                  ],
                })(<Input autoComplete={'off'} type="password" placeholder="請輸入密碼" />)}
              </Form.Item>
              <Form.Item label="確認">
                {getFieldDecorator('confirm', {
                  rules: [
                    { required: true, message: '請再次輸入密碼！' },

                    {
                      validator: compareToFirstPassword,
                    },
                  ],
                })(<Input autoComplete={'off'} type="password" placeholder="請再次輸入密碼" />)}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ width: '100%' }}
                  loading={loading}
                  disabled={loading}
                >
                  註冊
                </Button>
                Or{' '}
                <Link href="/login">
                  <a>去登錄</a>
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

export default Form.create<IProps>({ name: 'register' })(_Register);
