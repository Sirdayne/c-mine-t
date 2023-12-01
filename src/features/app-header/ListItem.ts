interface ListItemCommon {
  id: string;
  isExternal: boolean;
  position: number;
  rel: string;
  target: string;
  title: string;
  url: string;
}
interface ListItemChildren extends ListItemCommon {
  badgeI18nKey?: string;
  badgeType?: string;
  parentId: string;
}

export interface ListItem extends ListItemCommon {
  children: ListItemChildren[];
}
