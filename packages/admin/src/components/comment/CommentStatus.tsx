import { Badge } from 'antd';
import React from 'react';

export const CommentStatus = ({ comment }) => {
  return <Badge color={!comment.pass ? 'gold' : 'green'} text={!comment.pass ? '未通過' : '通過'} />;
};
