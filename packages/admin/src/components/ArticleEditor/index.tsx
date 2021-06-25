import { CloseOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Editor as MDEditor } from '@components/Editor';
import { Button, Dropdown, Input, Menu, message, Modal, PageHeader, Popconfirm } from 'antd';
import cls from 'classnames';
import { default as Router } from 'next/router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';

import { useSetting } from '@/hooks/useSetting';
import { useToggle } from '@/hooks/useToggle';
import { useWarningOnExit } from '@/hooks/useWarningOnExit';
import { ArticleProvider } from '@/providers/article';
import { resolveUrl } from '@/utils';

import { ArticleSettingDrawer } from './ArticleSettingDrawer';
import style from './index.module.scss';

interface IProps {
  id?: string | number;
  article?: IArticle;
}

const REQUIRED_ARTICLE_ATTRS = [
  ['title', '請輸入文章標題'],
  ['content', '請輸入文章內容'],
];

// 副作用：傳給服務端的 category 需要是 id
const transformCategory = (article) => {
  if (article.category && article.category.id) {
    article.category = article.category.id;
  }
};
const transformTags = (article) => {
  if (Array.isArray(article.tags)) {
    try {
      article.tags = (article.tags as ITag[]).map((t) => t.id).join(',');
    } catch (e) {
      console.log(e);
    }
  }
};

export const ArticleEditor: React.FC<IProps> = ({ id: defaultId, article: defaultArticle = { title: '' } }) => {
  const isCreate = !defaultId; // 一開始是否是新建
  const setting = useSetting();
  const [id, setId] = useState(defaultId);
  const [article, setArticle] = useState<Partial<IArticle>>(defaultArticle);
  const [settingDrawerVisible, toggleSettingDrawerVisible] = useToggle(false);
  const [hasSaved, toggleHasSaved] = useToggle(false);

  const patchArticle = useMemo(
    () => (key) => (value) => {
      if (value.target) {
        value = value.target.value;
      }
      setArticle((article) => {
        article[key] = value;
        return article;
      });
    },
    []
  );

  // 校驗文章必要屬性
  const check = useCallback(() => {
    let canPublish = true;
    let errorMsg = null;
    REQUIRED_ARTICLE_ATTRS.forEach(([key, msg]) => {
      if (!article[key]) {
        errorMsg = msg;
        canPublish = false;
      }
    });
    if (!canPublish) {
      return Promise.reject(new Error(errorMsg));
    }
    return Promise.resolve();
  }, [article]);

  // 打開發布抽屜
  const openSetting = useCallback(() => {
    check()
      .then(() => {
        toggleSettingDrawerVisible();
      })
      .catch((err) => {
        message.warn(err.message);
      });
  }, [check, toggleSettingDrawerVisible]);

  const saveSetting = useCallback(
    (setting) => {
      toggleSettingDrawerVisible();
      Object.assign(article, setting);
    },
    [article, toggleSettingDrawerVisible]
  );

  // 保存草稿或者發布線上
  const saveOrPublish = useCallback(
    (patch = {}) => {
      const data = { ...article, ...patch };
      return check()
        .then(() => {
          transformCategory(data);
          transformTags(data);
          const promise = !isCreate ? ArticleProvider.updateArticle(id, data) : ArticleProvider.addArticle(data);
          return promise.then((res) => {
            setId(res.id);
            toggleHasSaved(true);
            message.success(res.status === 'draft' ? '文章已保存為草稿' : '文章已發布');
          });
        })
        .catch((err) => {
          message.warn(err.message);
          return Promise.reject(err);
        });
    },
    [article, isCreate, check, id, toggleHasSaved]
  );

  const saveDraft = useCallback(() => {
    return saveOrPublish({ status: 'draft' });
  }, [saveOrPublish]);

  const publish = useCallback(() => {
    return saveOrPublish({ status: 'publish' });
  }, [saveOrPublish]);

  // 預覽文章
  const preview = useCallback(() => {
    if (id) {
      if (!setting.systemUrl) {
        message.error('尚未配置前台地址，無法正確構建預覽地址');
        return;
      }
      window.open(resolveUrl(setting.systemUrl, '/article/' + id));
    } else {
      message.warn('請先保存');
    }
  }, [id, setting.systemUrl]);

  const deleteArticle = useCallback(() => {
    if (!id) {
      return;
    }
    const handle = () => {
      ArticleProvider.deleteArticle(id).then(() => {
        toggleHasSaved(true);
        message.success('文章刪除成功');
        Router.push('/article');
      });
    };
    Modal.confirm({
      title: '確認刪除？',
      content: '刪除內容後，無法恢復。',
      onOk: handle,
      okText: '確認',
      cancelText: '取消',
      transitionName: '',
      maskTransitionName: '',
    });
  }, [id, toggleHasSaved]);

  const goback = useCallback(() => {
    Router.push('/article');
  }, []);

  useEffect(() => {
    if (isCreate && id) {
      Router.replace('/article/editor/' + id);
    }
  }, [id, isCreate]);

  useWarningOnExit(!hasSaved, () => window.confirm('確認關閉？如果有內容變更，請先保存!'));

  return (
    <div className={style.wrapper}>
      <Helmet>
        <title>{id ? `編輯文章 ${article.title ? '-' + article.title : ''}` : '新建文章'}</title>
      </Helmet>
      <header className={style.header}>
        <PageHeader
          backIcon={<Button size="small" icon={<CloseOutlined />} />}
          style={{
            borderBottom: '1px solid rgb(235, 237, 240)',
          }}
          onBack={goback}
          title={
            <Input
              style={{ width: 300 }}
              placeholder="請輸入文章標題"
              defaultValue={article.title}
              onChange={patchArticle('title')}
            />
          }
          extra={[
            <Button key="publish" type="primary" onClick={publish}>
              發布
            </Button>,
            <Dropdown
              key="more"
              overlay={
                <Menu>
                  <Menu.Item key="view" disabled={isCreate} onClick={preview}>
                    查看
                  </Menu.Item>
                  <Menu.Item key="setting" onClick={openSetting}>
                    設置
                  </Menu.Item>
                  <Menu.Divider key="divide-1" />
                  <Menu.Item key="draft" onClick={saveDraft}>
                    保存草稿
                  </Menu.Item>
                  <Menu.Divider key="divide-2" />
                  <Menu.Item key="delete" disabled={isCreate} onClick={deleteArticle}>
                    刪除
                  </Menu.Item>
                </Menu>
              }
            >
              <Button icon={<EllipsisOutlined />} type="link"></Button>
            </Dropdown>,
          ]}
        />
      </header>
      <main className={cls(style.main)}>
        <MDEditor
          defaultValue={article.content}
          onChange={({ value, html, toc }) => {
            patchArticle('content')(value);
            patchArticle('html')(html);
            patchArticle('toc')(toc);
          }}
        />
      </main>
      <ArticleSettingDrawer
        article={article as IArticle}
        visible={settingDrawerVisible}
        onClose={toggleSettingDrawerVisible}
        onChange={saveSetting}
      />
    </div>
  );
};
