const SKIPPED_HTML_TAGS = ['SCRIPT', 'TEMPLATE', 'LINK'];

const hasParent = (node: Node) => Boolean(node.parentNode);

const isValidTextNode = (node: Node): boolean => node.nodeType === Node.TEXT_NODE && Boolean(node.nodeValue);

const isValidElementNode = (node: Node): boolean => {
  if (node.nodeType !== Node.ELEMENT_NODE) return false;

  const el = node as HTMLElement;

  if (el.hasAttribute('data-ct-story-hidden')) return false;
  if (SKIPPED_HTML_TAGS.includes(el.tagName)) return false;

  return true;
};

const isValidNode = (node: Node): boolean => hasParent(node) && (isValidTextNode(node) || isValidElementNode(node));

const removeNode = (node: Node): void => {
  node.parentNode?.removeChild(node);
};

export class DOMSanitizer {
  sanitize(node: Node): void {
    this._sanitizeNode(node);
  }

  private _sanitizeNode(node: Node): void {
    if (!isValidNode(node)) {
      removeNode(node);
      return;
    }

    for (const childNode of node.childNodes) this._sanitizeNode(childNode);
  }
}
