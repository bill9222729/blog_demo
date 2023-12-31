import { Form } from '@ant-design/compatible';
import { Avatar, Button, Card, Col, Input, List, message, Row, Tabs, Typography } from 'antd';
import { NextPage } from 'next';
import { default as Router } from 'next/router';
import React, { useCallback, useContext, useState } from 'react';

import { FileSelectDrawer } from '@/components/FileSelectDrawer';
import { GlobalContext } from '@/context/global';
import { AdminLayout } from '@/layout/AdminLayout';
import { ArticleProvider } from '@/providers/article';
import { CategoryProvider } from '@/providers/category';
import { CommentProvider } from '@/providers/comment';
import { FileProvider } from '@/providers/file';
import { TagProvider } from '@/providers/tag';
import { UserProvider } from '@/providers/user';

import styles from './index.module.scss';

interface IOwnspaceProps {
  articlesCount: number;
  tagsCount: number;
  categoryCount: number;
  filesCount: number;
  commentsCount: number;
}

const { TabPane } = Tabs;

const Ownspace: NextPage<IOwnspaceProps> = ({
  articlesCount = 0,
  tagsCount = 0,
  categoryCount = 0,
  filesCount = 0,
  commentsCount = 0,
}) => {
  const data = [
    `累計發表了 ` + articlesCount + ' 篇文章',
    `累計創建了 ` + categoryCount + ' 個分類',
    `累計創建了 ` + tagsCount + ' 個標籤',
    `累計上傳了 ` + filesCount + ' 個文件',
    `累計獲得了 ` + commentsCount + ' 個評論',
  ];
  const globalContext = useContext(GlobalContext);
  const [user, setUser] = useState<Partial<IUser>>(globalContext.user);
  const [visible, setVisible] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword1, setNewPassword1] = useState(null);
  const [newPassword2, setNewPassword2] = useState(null);

  const save = useCallback(() => {
    UserProvider.update(user).then((res) => {
      globalContext.setUser(res);
      message.success('用戶訊息已保存');
    });
  }, [user, globalContext]);

  const changePassword = () => {
    if (!oldPassword || !newPassword1 || !newPassword2) {
      return;
    }

    if (newPassword1 !== newPassword2) {
      message.error('兩次密碼不一致');
      return;
    }

    if (newPassword2.length <= 8) {
      message.error('密碼長度過短');
      return;
    }

    const data = { ...user, oldPassword, newPassword: newPassword2 };
    UserProvider.updatePassword(data).then(() => {
      message.success('密碼已更新，請重新登入');
      Router.replace('login?redirect=/ownspace');
    });
  };

  return (
    <AdminLayout>
      <Row gutter={16} className={styles.wrapper}>
        <Col span={12} md={12} xs={24}>
          <List
            style={{ backgroundColor: '#fff' }}
            header={'系統概覽'}
            dataSource={data}
            bordered={true}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text>{item}</Typography.Text>
              </List.Item>
            )}
          />
          <FileSelectDrawer
            visible={visible}
            onClose={() => {
              setVisible(false);
            }}
            onChange={(url) => {
              setUser((user) => {
                user.avatar = url;
                return user;
              });
              setVisible(false);
            }}
          />
        </Col>
        {user && (
          <Col span={12} md={12} xs={24}>
            <Card title="個人資料" bordered={true}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="基本設置" key="1">
                  <Form.Item labelCol={{ xs: 8, sm: 6, md: 4 }} labelAlign="left">
                    <div
                      style={{ textAlign: 'center' }}
                      onClick={() => {
                        setVisible(true);
                      }}
                    >
                      <Avatar size={64} src={user.avatar} />
                    </div>
                  </Form.Item>
                  <Form.Item label="使用者名稱" labelCol={{ xs: 8, sm: 6, md: 4 }} labelAlign="left">
                    <Input
                      placeholder="請輸入使用者名稱"
                      defaultValue={user.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        setUser((user) => {
                          user.name = value;
                          return user;
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="信箱" labelCol={{ xs: 8, sm: 6, md: 4 }} labelAlign="left">
                    <Input
                      placeholder="請輸入信箱"
                      defaultValue={user.email}
                      onChange={(e) => {
                        const value = e.target.value;
                        const regexp = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

                        if (!regexp.test(value)) {
                          return;
                        }

                        setUser((user) => {
                          user.email = value;
                          return user;
                        });
                      }}
                    />
                  </Form.Item>
                  <Button type="primary" onClick={save}>
                    保存
                  </Button>
                </TabPane>
                <TabPane tab="更新密碼" key="2">
                  <Form.Item label="原密碼" labelCol={{ xs: 8, sm: 6, md: 4 }} labelAlign="left">
                    <Input.Password
                      placeholder="請輸入原密碼"
                      value={oldPassword}
                      onChange={(e) => {
                        const value = e.target.value;
                        setOldPassword(value);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="新密碼" labelCol={{ xs: 8, sm: 6, md: 4 }} labelAlign="left">
                    <Input.Password
                      placeholder="請輸入新密碼"
                      value={newPassword1}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewPassword1(value);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="確認密碼" labelCol={{ xs: 8, sm: 6, md: 4 }} labelAlign="left">
                    <Input.Password
                      placeholder="請確認新密碼"
                      value={newPassword2}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewPassword2(value);
                      }}
                    />
                  </Form.Item>
                  <Button type="primary" onClick={changePassword}>
                    更新
                  </Button>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        )}
      </Row>
    </AdminLayout>
  );
};

Ownspace.getInitialProps = async () => {
  const [articles, tags, category, files, comments] = await Promise.all([
    ArticleProvider.getArticles({ page: 1, pageSize: 6 }),
    TagProvider.getTags(),
    CategoryProvider.getCategory(),
    FileProvider.getFiles({ page: 1, pageSize: 6 }),
    CommentProvider.getComments({ page: 1, pageSize: 6 }),
  ]);

  return {
    articlesCount: articles[1],
    tagsCount: tags.length,
    categoryCount: category.length,
    filesCount: files[1],
    commentsCount: comments[1],
  };
};

export default Ownspace;
