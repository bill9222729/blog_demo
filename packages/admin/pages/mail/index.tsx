import { Alert, Button, message, Modal, Popconfirm } from 'antd';
import { NextPage } from 'next';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';

import { LocaleTime } from '@/components/LocaleTime';
import { PaginationTable } from '@/components/PaginationTable';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { usePagination } from '@/hooks/usePagination';
import { useSetting } from '@/hooks/useSetting';
import { AdminLayout } from '@/layout/AdminLayout';
import { MailProvider } from '@/providers/mail';

import style from './index.module.scss';

const SCROLL = { x: 1440 };
const SEARCH_FIELDS = [
  {
    label: '發件人',
    field: 'from',
    msg: '請輸入發件人',
  },
  {
    label: '收件人',
    field: 'to',
    msg: '請輸入收件人',
  },
  {
    label: '主題',
    field: 'subject',
    msg: '請輸入主題',
  },
];
const COMMON_COLUMNS = [
  {
    title: '發件人',
    dataIndex: 'from',
    key: 'from',
  },
  {
    title: '收件人',
    dataIndex: 'to',
    key: 'to',
  },
  {
    title: '主題',
    dataIndex: 'subject',
    key: 'subject',
  },
];
const TIME_COLUMN = {
  title: '發送時間',
  dataIndex: 'createAt',
  key: 'createAt',
  render: (date) => <LocaleTime date={date} />,
};

const Mail: NextPage = () => {
  const setting = useSetting();
  const { loading, data: mails, refresh, ...resetPagination } = usePagination<IMail>(MailProvider.getMails);
  const [deleteApi, deleteLoading] = useAsyncLoading(MailProvider.deleteMail);
  const [selectedMail, setSelectedMail] = useState(null);
  const isSmtpSettingFullfilled = useMemo(() => {
    return (
      setting &&
      setting.smtpHost &&
      setting.smtpPort &&
      setting.smtpUser &&
      setting.smtpFromUser &&
      setting.smtpFromUser
    );
  }, [setting]);

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

  const contentColumn = [
    {
      title: '內容',
      dataIndex: 'html',
      key: 'html',
      render: (_, record) => (
        <Button
          type="link"
          style={{ paddingLeft: 0 }}
          onClick={() => {
            setSelectedMail(record);
          }}
        >
          點擊查看
        </Button>
      ),
    },
  ];

  const actionColumn = (resetSelectedRows) => ({
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <span className={style.action}>
        <Popconfirm
          title="確認刪除這個郵件？"
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
        {!isSmtpSettingFullfilled ? (
          <div style={{ marginBottom: 24 }}>
            <Alert
              message={
                <span>
                  系統檢測到<strong>SMTP 配置</strong>未完善，當收到評論時，無法進行郵件通知。
                  <Link href="/setting?type=SMTP%20服務">
                    <a>點我立即完善</a>
                  </Link>
                </span>
              }
              type="warning"
            />
          </div>
        ) : null}
        <PaginationTable
          showSelection={true}
          loading={loading}
          data={mails}
          columns={(resetSelectedRows) => [
            ...COMMON_COLUMNS,
            contentColumn,
            TIME_COLUMN,
            actionColumn(resetSelectedRows),
          ]}
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
          scroll={SCROLL}
          searchFields={SEARCH_FIELDS}
        />
        <Modal
          title={'發送內容'}
          visible={selectedMail}
          footer={null}
          width={786 + 48}
          onCancel={() => {
            setSelectedMail(null);
          }}
          transitionName={''}
          maskTransitionName={''}
        >
          <div
            className="markdown"
            style={{ overflow: 'auto !important' }}
            dangerouslySetInnerHTML={{
              __html: selectedMail && selectedMail.html,
            }}
          ></div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Mail;
