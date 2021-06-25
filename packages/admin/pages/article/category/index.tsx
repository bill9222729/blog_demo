import { Form } from '@ant-design/compatible';
import { Button, Card, Col, Input, message, Popconfirm, Row } from 'antd';
import cls from 'classnames';
import { NextPage } from 'next';
import React, { useCallback, useMemo, useState } from 'react';

import { AdminLayout } from '@/layout/AdminLayout';
import { CategoryProvider } from '@/providers/category';

import style from './index.module.scss';

interface IProps {
  data: ICategory[];
}

const Page: NextPage<IProps> = ({ data: defaultData = [] }) => {
  const [data, setData] = useState(defaultData);
  const [mode, setMode] = useState('create');
  const [current, setCurrent] = useState(null);
  const [label, setLabel] = useState(null);
  const [value, setValue] = useState(null);

  const isCreateMode = useMemo(() => mode === 'create', [mode]);

  const getData = useCallback(() => {
    CategoryProvider.getCategory().then((res) => {
      setData(res);
    });
  }, []);

  const reset = useCallback(() => {
    setMode('create');
    setCurrent(null);
    setLabel(null);
    setValue(null);
  }, []);

  const addTag = useCallback(
    (data) => {
      if (!data || !data.label) {
        return;
      }

      CategoryProvider.add(data).then(() => {
        message.success('添加分類成功');
        reset();
        getData();
      });
    },
    [reset, getData]
  );

  const updateTag = useCallback(
    (id, data) => {
      if (!data || !data.label) {
        return;
      }

      CategoryProvider.update(id, data).then(() => {
        message.success('更新分類成功');
        reset();
        getData();
      });
    },
    [reset, getData]
  );

  const deleteTag = useCallback(
    (id) => {
      CategoryProvider.delete(id).then(() => {
        message.success('刪除分類成功');
        reset();
        getData();
      });
    },
    [reset, getData]
  );

  return (
    <AdminLayout>
      <Row gutter={16} className={style.wrapper}>
        <Col xs={24} sm={24} md={9}>
          <Card title={isCreateMode ? '添加分類' : '管理分類'} bordered={true}>
            <Form.Item>
              <Input
                value={label}
                placeholder={'輸入分類名稱'}
                onChange={(e) => {
                  setLabel(e.target.value);
                }}
              ></Input>
            </Form.Item>
            <Form.Item>
              <Input
                value={value}
                placeholder={'輸入分類值（請輸入英文，作為路由使用）'}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              ></Input>
            </Form.Item>
            <div className={cls(style.btns, isCreateMode ? false : style.isEdit)}>
              {isCreateMode ? (
                <Button type="primary" onClick={() => addTag({ label, value })}>
                  保存
                </Button>
              ) : (
                <>
                  <Button.Group>
                    <Button
                      type="primary"
                      onClick={() =>
                        updateTag(current.id, {
                          label,
                          value,
                        })
                      }
                    >
                      更新
                    </Button>
                    <Button type="dashed" onClick={() => reset()}>
                      返回添加
                    </Button>
                  </Button.Group>
                  <Popconfirm
                    title="確認刪除這個分類？"
                    onConfirm={() => deleteTag(current.id)}
                    okText="確認"
                    cancelText="取消"
                  >
                    <Button danger={true}>刪除</Button>
                  </Popconfirm>
                </>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={15}>
          <Card title="所有分類" bordered={true}>
            <ul className={style.list}>
              {data.map((d) => (
                <li
                  key={d.id}
                  className={cls(style.item)}
                  onClick={() => {
                    setMode('edit');
                    setCurrent(d);
                    setLabel(d.label);
                    setValue(d.value);
                  }}
                >
                  <a key={d.id} className={style.tag}>
                    <span>{d.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

Page.getInitialProps = async () => {
  const data = await CategoryProvider.getCategory();
  return { data };
};

export default Page;
