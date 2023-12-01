import { CustomRenderingItemParser } from './CustomRenderingItemParser';
import { CustomRenderingItem } from './CustomRenderingItem';
import { AdItemErrorCollector, AdItemErrors } from './AdItemErrorCollector';

const getElementInnerText = (element: HTMLElement): string => element.innerText || element.innerHTML;

/**
 * Revive HTML-encoded values in JSON
 * @param key
 * @param value
 */
export const htmlJsonReviver = (key: string, value: unknown): unknown => {
  if (typeof value !== 'string') return value;

  const span = document.createElement('span');
  span.innerHTML = value;
  return getElementInnerText(span);
};

/**
 * Parses custom rendering items from HTML+JSON spec
 *
 * @example
 * ```html
 * <script data-ad-type="promoButton">
 *   {
 *     "labelColor": "#fff",
 *     "labelText": "HitBTC"
 *   }
 * </script>
 * ```
 */
export class HtmlJsonCustomRenderingItemParser {
  constructor(
    private readonly _itemParser: CustomRenderingItemParser,
    private readonly _errorCollector: AdItemErrorCollector
  ) {}

  private _parseJson(script: HTMLElement): unknown {
    try {
      return JSON.parse(getElementInnerText(script), htmlJsonReviver);
    } catch (error) {
      this._errorCollector.add(AdItemErrors.FAILED_TO_PARSE_HTML_JSON);
      return null;
    }
  }

  private _parseFromElement(script: HTMLElement): CustomRenderingItem | null {
    const props = this._parseJson(script);
    const view = script.dataset.adType;
    return this._itemParser.parse(view, props);
  }

  private _parseToElements(body: string): Iterable<HTMLScriptElement> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, 'text/html');
    return doc.querySelectorAll<HTMLScriptElement>('script[data-ad-type]');
  }

  *parseFromHtml(body: string): Iterable<CustomRenderingItem> {
    for (const script of this._parseToElements(body)) {
      const parsed = this._parseFromElement(script);

      if (parsed) yield parsed;
    }
  }
}
