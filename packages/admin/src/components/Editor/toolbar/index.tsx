import React from 'react';

import { AddCode } from './AddCode';
import { Emoji } from './Emoji';
import { File } from './File';
import { Iframe } from './Iframe';
import { Image } from './Image';
import { Magimg } from './Magimg';
import { Video } from './Video';

export const toolbar = [
  {
    label: '表情',
    content: ({ editor, monaco }) => <Emoji editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
  {
    label: '上傳圖片',
    content: ({ editor, monaco }) => <Image editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
  {
    label: '上傳影片',
    content: ({ editor, monaco }) => <Video editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
  {
    label: '嵌入連結',
    content: ({ editor, monaco }) => <Iframe editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
  {
    label: '文件庫',
    content: ({ editor, monaco }) => <File editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
  {
    label: '放大圖片',
    content: ({ editor, monaco }) => <Magimg editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
  {
    label: '添加代碼塊',
    content: ({ editor, monaco }) => <AddCode editor={editor} monaco={monaco} />,
    getAction: () => () => {
      return undefined;
    },
  },
];
