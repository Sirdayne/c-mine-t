import { TableOfContentsViewModel } from './TableOfContentsViewModel';
import { createInjection } from '~/lib/shared';

export const { provide: provideTOCViewModel, use: useTOCViewModel } =
  createInjection<TableOfContentsViewModel>('table-of-contents-view-model');
