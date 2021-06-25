import { Divider, Input, message, Modal, notification, Popconfirm } from 'antd';
import React, { useCallback, useState } from 'react';

import { useSetting } from '@/hooks/useSetting';
import { CommentProvider } from '@/providers/comment';
import { SettingProvider } from '@/providers/setting';

import style from './index.module.scss';

export const CommentAction = ({ comment, refresh }) => {
  const setting = useSetting();
  const [replyContent, setReplyContent] = useState(null);
  const [replyVisible, setReplyVisible] = useState(false);

  // 修改評論
  const updateComment = useCallback(
    (comment, pass = false) => {
      CommentProvider.updateComment(comment.id, { pass }).then(() => {
        message.success(pass ? '評論已通過' : '評論已拒絕');
        refresh();
      });
    },
    [refresh]
  );

  const reply = useCallback(() => {
    if (!replyContent) {
      return;
    }
    const userInfo = JSON.parse(window.localStorage.getItem('user'));
    const email = (userInfo && userInfo.mail) || (setting && setting.smtpFromUser);
    const notify = () => {
      notification.error({
        message: '回復評論失敗',
        description: '請前往系統設置完善 SMTP 設置，前往個人中心更新個人信箱。',
      });
    };

    const handle = (email) => {
      const data = {
        name: userInfo.name,
        email,
        content: replyContent,
        parentCommentId: comment.parentCommentId || comment.id,
        hostId: comment.hostId,
        isHostInPage: comment.isHostInPage,
        replyUserName: comment.name,
        replyUserEmail: comment.email,
        url: comment.url,
        createByAdmin: true,
      };

      CommentProvider.addComment(data)
        .then(() => {
          message.success('回復成功');
          setReplyContent('');
          refresh();
        })
        .catch(() => notify());
    };

    if (!email) {
      SettingProvider.getSetting()
        .then((res) => {
          if (res && res.smtpFromUser) {
            handle(res.smtpFromUser);
          } else {
            notify();
          }
          setReplyVisible(false);
        })
        .catch(() => {
          notify();
          setReplyVisible(false);
        });
    } else {
      handle(email);
      setReplyVisible(false);
    }
  }, [
    replyContent,
    comment.email,
    comment.hostId,
    comment.id,
    comment.isHostInPage,
    comment.name,
    comment.parentCommentId,
    comment.url,
    refresh,
    setting,
  ]);

  // 刪除評論
  const deleteComment = useCallback(
    (id) => {
      CommentProvider.deleteComment(id).then(() => {
        message.success('評論刪除成功');
        refresh();
      });
    },
    [refresh]
  );

  return (
    <div>
      <span className={style.action}>
        <a onClick={() => updateComment(comment, true)}>通過</a>
        <Divider type="vertical" />
        <a onClick={() => updateComment(comment, false)}>拒絕</a>
        <Divider type="vertical" />
        <a onClick={() => setReplyVisible(true)}>回復</a>
        <Divider type="vertical" />
        <Popconfirm
          title="確認刪除這個評論？"
          onConfirm={() => deleteComment(comment.id)}
          okText="確認"
          cancelText="取消"
        >
          <a>刪除</a>
        </Popconfirm>
      </span>
      <Modal
        title={'回復評論'}
        visible={replyVisible}
        cancelText={'取消'}
        okText={'回復'}
        onOk={reply}
        onCancel={() => setReplyVisible(false)}
        transitionName={''}
        maskTransitionName={''}
      >
        <Input.TextArea
          autoSize={{ minRows: 6, maxRows: 10 }}
          placeholder="支持 Markdown"
          value={replyContent}
          autoFocus={true}
          onChange={(e) => {
            const val = e.target.value;
            setReplyContent(val);
          }}
        ></Input.TextArea>
      </Modal>
    </div>
  );
};
