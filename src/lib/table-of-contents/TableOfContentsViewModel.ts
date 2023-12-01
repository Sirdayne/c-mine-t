import { shallowRef, unref } from 'vue';
import { MaybeRef } from '@vueuse/core';

export interface TableOfContentsViewModelInterface {
  getTableOfContents(): TableOfContentsItem[];

  buildTableOfContent(node: HTMLElement): void;

  scrollTo(id?: string): void;
}

export interface TableOfContentsItem {
  title: string;
  id: string;
}

export class TableOfContentsViewModel implements TableOfContentsViewModelInterface {
  private _tableOfContents = shallowRef<TableOfContentsItem[]>([]);

  constructor(
    /**
     * In case _specialPostCategory = true we create ToC only with h2 elements otherwise we keep h2,h3
     * */
    private readonly _specialPostCategory: MaybeRef<boolean> = false
  ) {}

  getTableOfContents() {
    return unref(this._tableOfContents);
  }

  buildTableOfContent(contentEl: HTMLElement): void {
    const tableOfContents: TableOfContentsItem[] = [];
    let nodeList = Array.from(contentEl.querySelectorAll('h2, h3'));

    if (this._specialPostCategory) {
      nodeList = Array.from(contentEl.querySelectorAll('h2'));
    }

    for (const [index, node] of nodeList.entries()) {
      tableOfContents.push({
        title: (<HTMLElement>node).innerText,
        id: `contentRef_${index}`,
      });
      node.setAttribute('id', `contentRef_${index}`);
    }
    this._tableOfContents.value = tableOfContents;
  }

  scrollTo(articleId: string) {
    document?.getElementById(articleId)?.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
