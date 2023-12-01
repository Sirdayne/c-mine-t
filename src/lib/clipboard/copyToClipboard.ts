import { captureError } from '~/lib/telemetry';

export const copyToClipboard = (text: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const span = document.createElement('span');
  span.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
  span.textContent = text;
  span.style.whiteSpace = 'pre';
  document.body.appendChild(span);
  const selection = window.getSelection() as Selection;
  const range = window.document.createRange();
  selection.removeAllRanges();
  range.selectNode(span);
  selection.addRange(range);
  let success = false;
  try {
    success = window.document.execCommand('copy');
  } catch (e) {
    captureError(e);
  }
  selection.removeAllRanges();
  window.document.body.removeChild(span);
  return success ? Promise.resolve() : Promise.reject();
};
