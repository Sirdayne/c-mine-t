/**
 * Between content insertion algorithm
 *
 * ```puml
 * @startuml
 *
 * start;
 *
 * :let anchor be first element
 * that located after 30% of content height;
 *
 * if (anchor comes after heading) then (yes)
 *   :anchor is element before anchor;
 * else (no);
 * endif;
 *
 * if (anchor ?)
 *   :insert widget before anchor;
 *   stop;
 * else
 *   :insert widget to end of content;
 *   stop;
 *
 * @enduml
 * ```
 */
const HEADING_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
const IN_ARTICLE_CONTENT_HEIGHT_THRESHOLD = 0.35;

/**
 * Element is heading
 * @param {Element} element
 * @returns {boolean}
 */
export const isHeadingElement = (element) => HEADING_TAGS.has(element.tagName);

/**
 * Find first child element of content
 * @param {HTMLElement} containerElement
 * @returns {HTMLElement}
 */
const findAnchorElement = (containerElement) => {
  const firstChild = containerElement.firstElementChild;

  if (
    firstChild.tagName !== 'DIV' &&
    firstChild.nextElementSibling &&
    firstChild.nextElementSibling.tagName === 'DIV'
  ) {
    /**
     * Find element with the biggest height value, so it means that its main content
     * */
    let nodeWithMaxHeight = null;

    for (const childNode of containerElement.childNodes) {
      if (!nodeWithMaxHeight) nodeWithMaxHeight = childNode;

      if (childNode.nodeName === '#text') continue;

      if (nodeWithMaxHeight.offsetHeight < childNode.offsetHeight) {
        nodeWithMaxHeight = childNode;
      }
    }

    return nodeWithMaxHeight.firstElementChild;
  } else {
    return firstChild;
  }
};
/**
 * Find child element, that comes after thrshold
 * @param {HTMLElement} containerElement
 * @param {number} heightThreshold Percentage of height after widget expected to be, in decimal
 * @returns {null|HTMLElement}
 *
 * @example ```javascript
 * findChildElementAfterThreshold(root, 0.3);
 * // => first child element after 30% of container height
 * ```
 */
export const findChildElementAfterThreshold = (containerElement, heightThreshold) => {
  const contentHeight = containerElement.offsetHeight;
  for (
    let anchorElement = findAnchorElement(containerElement);
    anchorElement !== null;
    anchorElement = anchorElement.nextElementSibling
  ) {
    const heightQuotient = anchorElement.offsetTop / contentHeight;

    if (heightQuotient > heightThreshold) return anchorElement;
  }

  return null;
};

/**
 * @param {HTMLElement} contentElement Element hosting content
 * @param {HTMLElement} targetElement Element to insert
 */
export const insertElementBetweenContent = (contentElement, targetElement) => {
  let anchorElement = findChildElementAfterThreshold(contentElement, IN_ARTICLE_CONTENT_HEIGHT_THRESHOLD);

  if (anchorElement && !isHeadingElement(anchorElement)) {
    anchorElement = anchorElement.nextElementSibling;
  }

  if (anchorElement) {
    anchorElement.parentElement.insertBefore(targetElement, anchorElement);
  } else {
    contentElement.appendChild(targetElement);
  }
};
