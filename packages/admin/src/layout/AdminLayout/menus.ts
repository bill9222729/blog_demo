export const menus = [
  {
    icon: 'dashboard',
    title: '工作檯',
    path: '/',
  },
  {
    icon: 'form',
    title: '文章管理',
    children: [
      {
        icon: 'form',
        title: '所有文章',
        path: '/article',
      },
      {
        title: '新建文章',
        path: '/article/editor',
        ignore: true,
      },
      {
        title: '編輯文章',
        path: '/article/editor/[id]',
        ignore: true,
      },
      {
        icon: 'copy',
        title: '分類管理',
        path: '/article/category',
      },
      {
        icon: 'tag',
        title: '標籤管理',
        path: '/article/tags',
      },
    ],
  },
  {
    icon: 'snippets',
    title: '頁面管理',
    path: '/page',
  },
  {
    title: '新建頁面',
    path: '/page/editor',
    ignore: true,
  },
  {
    title: '編輯頁面',
    path: '/page/editor/[id]',
    ignore: true,
  },
  {
    title: '知識小冊',
    path: '/knowledge',
    icon: 'book',
  },
  {
    icon: 'message',
    title: '評論管理',
    path: '/comment',
  },
  {
    icon: 'mail',
    title: '郵件管理',
    path: '/mail',
  },
  {
    icon: 'folder-open',
    title: '文件管理',
    path: '/file',
  },
  {
    icon: 'search',
    title: '搜索記錄',
    path: '/search',
  },
  {
    icon: 'project',
    title: '訪問統計',
    path: '/view',
  },
  {
    title: '個人中心',
    icon: 'user',
    path: '/ownspace',
    ignore: true,
  },
  {
    icon: 'user',
    title: '用戶管理',
    path: '/user',
  },
  {
    icon: 'setting',
    title: '系統設置',
    path: '/setting',
  },
];

const flattenMenus = menus
  .filter((m) => !m.ignore)
  .reduce((c, menu) => {
    return [...c, menu, ...(menu.children || []).filter((m) => !m.ignore)];
  }, []);

export const findActiveMenu = (pathname) => {
  const idx = flattenMenus.findIndex((menu) => menu.path === pathname);
  if (idx < 0) {
    return [null, []];
  }

  const activeMenu = flattenMenus[idx];
  const breadcrumbs =
    idx > 1
      ? [
          flattenMenus.slice(0, 1)[0],
          ...flattenMenus.slice(1, idx).filter((menu) => {
            return activeMenu.path.includes(menu.path);
          }),
          activeMenu,
        ]
      : [flattenMenus.slice(0, 1)[0]];

  return [activeMenu, breadcrumbs];
};
