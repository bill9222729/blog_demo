import { Badge, Button, Divider, message, Select } from 'antd';
import { NextPage } from 'next';
import React, { useCallback, useEffect } from 'react';

import { LocaleTime } from '@/components/LocaleTime';
import { PaginationTable } from '@/components/PaginationTable';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { usePagination } from '@/hooks/usePagination';
import { AdminLayout } from '@/layout/AdminLayout';
import { UserProvider } from '@/providers/user';

import style from './index.module.scss';

let updateLoadingMessage = null;
const COMMON_COLUMNS = [
  {
    title: '帳戶',
    dataIndex: 'name',
    key: 'name',
    width: '10%',
  },
  {
    title: '信箱',
    dataIndex: 'email',
    key: 'mail',
    width: '20%',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    render: (role) => {
      return role === 'admin' ? '管理員' : '訪客';
    },
  },
  {
    title: '類型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '狀態',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const isLocked = status === 'locked';
      return <Badge color={isLocked ? 'gold' : 'green'} text={isLocked ? '已鎖定' : '可用'} />;
    },
  },
  {
    title: '註冊日期',
    dataIndex: 'createAt',
    key: 'createAt',
    render: (date) => <LocaleTime date={date} />,
  },
];
const SEARCH_FIELDS = [
  {
    label: '帳戶',
    field: 'name',
    msg: '請輸入用戶帳戶',
  },
  {
    label: '信箱',
    field: 'email',
    msg: '請輸入帳戶信箱',
  },
  {
    label: '角色',
    field: 'role',
    children: (
      <Select style={{ width: 180 }}>
        {[
          { label: '管理員', value: 'admin' },
          { label: '訪客', value: 'visitor' },
        ].map((t) => {
          return (
            <Select.Option key={t.label} value={t.value}>
              {t.label}
            </Select.Option>
          );
        })}
      </Select>
    ),
  },
  {
    label: '狀態',
    field: 'status',
    children: (
      <Select style={{ width: 180 }}>
        {[
          { label: '鎖定', value: 'locked' },
          { label: '可用', value: 'active' },
        ].map((t) => {
          return (
            <Select.Option key={t.label} value={t.value}>
              {t.label}
            </Select.Option>
          );
        })}
      </Select>
    ),
  },
  {
    label: '類型',
    field: 'type',
    msg: '請輸入用戶類型',
  },
];

const Page: NextPage = () => {
  const { loading, data, refresh, ...resetPagination } = usePagination<IUser>(UserProvider.getUsers);
  const [updateApi, updateLoading] = useAsyncLoading(UserProvider.update);

  const updateAction = useCallback(
    (users, key, value = null) => {
      if (!Array.isArray(users)) {
        users = [users];
      }
      return () =>
        Promise.all(users.map((user) => updateApi({ ...user, [key]: value !== null ? value : !user[key] }))).then(
          () => {
            message.success('操作成功');
            refresh();
          }
        );
    },
    [updateApi, refresh]
  );

  const actionColumn = {
    title: '操作',
    key: 'action',
    render: (_, record) => {
      const isLocked = record.status === 'locked';
      const isAdmin = record.role === 'admin';

      return (
        <span className={style.action}>
          {isLocked ? (
            <a onClick={updateAction(record, 'status', 'active')}>啟用</a>
          ) : (
            <a onClick={updateAction(record, 'status', 'locked')}>禁用</a>
          )}
          <Divider type="vertical" />
          {isAdmin ? (
            <a onClick={updateAction(record, 'role', 'visitor')}>解除授權</a>
          ) : (
            <a onClick={updateAction(record, 'role', 'admin')}>授權</a>
          )}
        </span>
      );
    },
  };

  useEffect(() => {
    if (updateLoading) {
      updateLoadingMessage = message.loading('操作中...', 0);
    } else {
      updateLoadingMessage && updateLoadingMessage();
    }
  }, [updateLoading]);

  return (
    <AdminLayout>
      <div className={style.wrapper}>
        <PaginationTable
          showSelection={true}
          loading={loading}
          data={data}
          columns={[...COMMON_COLUMNS, actionColumn]}
          refresh={refresh}
          {...resetPagination}
          renderLeftNode={({ hasSelected, selectedRows }) =>
            hasSelected ? (
              <>
                <Button
                  style={{ marginRight: 8 }}
                  disabled={!hasSelected}
                  onClick={updateAction(selectedRows, 'status', 'active')}
                >
                  啟用
                </Button>
                <Button
                  style={{ marginRight: 8 }}
                  disabled={!hasSelected}
                  onClick={updateAction(selectedRows, 'status', 'locked')}
                >
                  禁用
                </Button>
                <Button
                  style={{ marginRight: 8 }}
                  disabled={!hasSelected}
                  onClick={updateAction(selectedRows, 'role', 'visitor')}
                >
                  解除授權
                </Button>
                <Button disabled={!hasSelected} onClick={updateAction(selectedRows, 'role', 'admin')}>
                  授權
                </Button>
              </>
            ) : null
          }
          searchFields={SEARCH_FIELDS}
        />
      </div>
    </AdminLayout>
  );
};

export default Page;
