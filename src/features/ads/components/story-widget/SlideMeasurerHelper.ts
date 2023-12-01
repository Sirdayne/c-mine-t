export class SlideMeasurerHelper {
  constructor(private readonly _slideMeasurerElement: HTMLElement) {}

  isChildrenOverflows(): boolean {
    const { scrollHeight, offsetHeight } = this._slideMeasurerElement;
    return scrollHeight > offsetHeight;
  }

  flush(): string {
    const html = this._slideMeasurerElement.innerHTML;
    this._slideMeasurerElement.innerHTML = '';
    return html;
  }

  /**
   * @returns slide html or null
   */
  append(node: Node): string | null {
    this._appendNode(node);

    if (this.isChildrenOverflows()) {
      this._removeLastChild();
      const html = this.flush();
      this._appendNode(node);

      return html;
    }

    return null;
  }

  toggleVisibility(visible: boolean): void {
    this._slideMeasurerElement.style.setProperty('display', visible ? 'block' : 'none');
  }

  private _appendNode(node: Node): void {
    this._slideMeasurerElement.appendChild(node.cloneNode(true));
  }

  private _removeLastChild(): void {
    const { lastChild } = this._slideMeasurerElement;

    if (lastChild) this._slideMeasurerElement.removeChild(lastChild);
  }
}
