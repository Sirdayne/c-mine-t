interface MenuItem {
  id: string;
  isExternal: boolean;
  position: number;
  rel: string;
  target: '_self' | '_blank';
  title: string;
  url: string;
}

export interface MenuParentItem extends MenuItem {
  children: MenuChildItem[];
}
export interface MenuChildItem extends MenuItem {
  badgeI18nKey?: string;
  badgeType?: string;
  parentId: string;
}
