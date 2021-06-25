interface IUser {
  name: string;
  avatar: string;
  email: string;
  token: string;
  role: 'admin' | 'visitor';
  type: string;
}

interface IFile {
  id: string;
  originalname: string;
  filename: string;
  type: string;
  size: number;
  url: string;
  createAt: string;
}

interface IArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags?: Itag[] | string[] | string;
  cover?: string;
  toc: string;
  views: number;
  category: any;
  status: string;
  password?: string; // 訪問密碼
  needPassword: boolean;
  isRecommended?: boolean;
  isCommentable?: boolean; // 是否可評論
  likes: number;
  createAt: string;
  updateAt: string;
  publishAt: string;
}

interface ITag {
  id: string;
  label: string;
  value: string;
}

interface ICategory {
  id: string;
  label: string;
  value: string;
}

interface IKnowledge {
  id: string;
  parentId: string;
  order: number;
  title: string;
  cover?: string;
  summary: string;
  content: string;
  html: string;
  toc: string;
  views: number;
  status: 'draft' | 'publish';
  isCommentable?: boolean;
  createAt: string;
  updateAt: string;
  publishAt: string;
  children?: Array<IKnowledge>;
}

interface IPage {
  id: string;
  name: string;
  path: string;
  order: number;
  cover?: string;
  content: string;
  toc: string;
  status: string;
  views: number;
  createAt: string;
  publishAt: string;
}

interface IComment {
  id: string;
  name: string;
  email: string;
  content: string;
  html: string;
  pass: boolean;
  createAt: string;
  userAgent: string;
  article?: IArticle;
  parentCommentId: string;
  hostId: string;
  replyUserName?: string;
  replyUserEmail?: string;
  children?: [IComment];
}

interface IView {
  id: string;
  ip: string;
  userAgent: string;
  url: string;
  browser: string;
  engine: string;
  os: string;
  device: string;
  count: number;
  createAt: string;
  updateAt: string;
}

interface IMail {
  id: string;
  from: string;
  to: string;
  subject: number;
  text: string;
  html: string;
  createAt: string;
}

interface ISearch {
  id: string;
  type: string;
  keyword: string;
  count: number;
  createAt: string;
}

interface ISetting {
  i18n?: string; // 國際化
  systemUrl?: string; // 系統地址
  systemTitle?: string; // 系統標題
  systemBg?: string; // 全局背景
  systemLogo?: string; // 系統 Logo
  systemFavicon?: string; // 系統 favicon
  systemFooterInfo?: string; // 系統頁尾訊息
  adminSystemUrl?: string; // 後台系統地址

  seoKeyword?: string; // SEO 關鍵字
  seoDesc?: string; //  SEO 描述

  baiduAnalyticsId?: string; // 百度統計 id
  googleAnalyticsId?: string; // Google分析 id

  ossRegion?: string; // 阿里雲 region
  ossAccessKeyId?: string; //  阿里雲 accessKeyId
  ossAccessKeySecret?: string; //  阿里雲  accessKeySecret
  ossHttps?: boolean; //  阿里雲 oss 是否開啟 https
  ossBucket?: string; //  阿里雲 bucket

  oss?: string; // oss 上傳配置

  smtpHost?: string; //   SMTP 地址
  smtpPort?: number; //  SMTP 埠
  smtpUser?: string; //  SMTP 用戶
  smtpPass?: string; //  SMTP 授權碼
  smtpFromUser?: string; // SMTP 發件人
}

interface IPoster {
  id: string;
  name: string;
  pageUrl: string;
  imgUrl: string;
  size: number;
  createAt: string;
}
