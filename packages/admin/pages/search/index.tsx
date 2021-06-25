import { Badge, Button, message, Popconfirm } from 'antd';
import { NextPage } from 'next';
import React, { useCallback } from 'react';

import { LocaleTime } from '@/components/LocaleTime';
import { PaginationTable } from '@/components/PaginationTable';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { usePagination } from '@/hooks/usePagination';
import { AdminLayout } from '@/layout/AdminLayout';
import { SearchProvider } from '@/providers/search';

import style from './index.module.scss';

const COMMON_COLUMNS = [
  {
    title: '搜索詞',
    dataIndex: 'keyword',
    key: 'keyword',
  },
  {
    title: '搜索量',
    dataIndex: 'count',
    key: 'count',
    render: (views) => (
      <Badge count={views} showZero={true} overflowCount={Infinity} style={{ backgroundColor: '#52c41a' }} />
    ),
  },
  {
    title: '搜索時間',
    dataIndex: 'createAt',
    key: 'createAt',
    render: (date) => <LocaleTime date={date} />,
  },
];

const SEARCH_FIELDS = [
  {
    label: '類型',
    field: 'type',
    msg: '請輸入搜索類型',
  },
  {
    label: '搜索詞',
    field: 'keyword',
    msg: '請輸入搜索詞',
  },
  {
    label: '搜索量',
    field: 'count',
    msg: '請輸入搜索量',
  },
];

const Search: NextPage = () => {
  const { loading, data, refresh, ...resetPagination } = usePagination<ISearch>(SearchProvider.getRecords);
  const [deleteApi, deleteLoading] = useAsyncLoading(SearchProvider.deleteRecord);

  const deleteAction = useCallback(
    (ids, resetSelectedRows = null) => {
      if (!Array.isArray(ids)) {
        ids = [ids];
      }
      return () => {
        Promise.all(ids.map((id) => deleteApi(id))).then(() => {
          message.success('操作成功');
          resetSelectedRows && resetSelectedRows();
          refresh();
        });
      };
    },
    [deleteApi, refresh]
  );

  const actionColumn = (resetSelectedRows) => ({
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <span className={style.action}>
        <Popconfirm
          title="確認刪除這個搜索記錄？"
          onConfirm={deleteAction(record.id, resetSelectedRows)}
          okText="確認"
          cancelText="取消"
        >
          <a>刪除</a>
        </Popconfirm>
      </span>
    ),
  });

  return (
    <AdminLayout>
      <div className={style.wrapper}>
        <PaginationTable
          showSelection={true}
          loading={loading}
          data={data}
          columns={(resetSelectedRows) => [...COMMON_COLUMNS, actionColumn(resetSelectedRows)]}
          refresh={refresh}
          {...resetPagination}
          renderLeftNode={({ hasSelected, selectedRowKeys, resetSelectedRows }) =>
            hasSelected ? (
              <Popconfirm
                title="確認刪除？"
                onConfirm={deleteAction(selectedRowKeys, resetSelectedRows)}
                okText="確認"
                cancelText="取消"
              >
                <Button disabled={!hasSelected} loading={deleteLoading} danger={true}>
                  刪除
                </Button>
              </Popconfirm>
            ) : null
          }
          searchFields={SEARCH_FIELDS}
        />
      </div>
    </AdminLayout>
  );
};

export default Search;
