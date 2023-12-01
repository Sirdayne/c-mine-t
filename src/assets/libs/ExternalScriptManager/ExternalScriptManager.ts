import { ExternalScript } from './ExternalScript';

// key to store ExternalScript instance in element (like multiton pattern)
const EXTERNAL_SCRIPT_ELEMENT_KEY = Symbol('external script state');

export class ExternalScriptManager {
  private _createScriptElement(src: string): HTMLScriptElement {
    const scriptElement = document.createElement('script');

    scriptElement.src = src;
    scriptElement.async = true;
    scriptElement.setAttribute('data-ct-external-script', '');

    return scriptElement;
  }

  private _findScriptElement(src: string): HTMLScriptElement | null {
    for (const script of document.querySelectorAll<HTMLScriptElement>(`script[data-ct-external-script]`)) {
      if (script.src === src) {
        return script;
      }
    }

    return null;
  }

  add(src: string): ExternalScript {
    let scriptElement = this._findScriptElement(src);

    if (!scriptElement) {
      scriptElement = this._createScriptElement(src);
      document.body.appendChild(scriptElement);
    }

    // @ts-expect-error unsafe read persisted instance from element
    let externalScript: ExternalScript = scriptElement[EXTERNAL_SCRIPT_ELEMENT_KEY];

    if (!externalScript) {
      // @ts-expect-error unsafe set instance to element
      externalScript = scriptElement[EXTERNAL_SCRIPT_ELEMENT_KEY] = new ExternalScript(scriptElement);
      externalScript.init();
    }

    return externalScript;
  }
}
